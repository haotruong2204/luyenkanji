import fs from "fs";
import path from "path";

interface SearchListItem {
  k: string; // kanji
  r: string; // reading (hiragana)
  o?: string; // on'yomi reading
  m: string; // meaning (Vietnamese)
  h?: string; // Han Viet reading (âm Hán Việt)
  g: number; // grade
}

interface APIResponseItem {
  k: string; // kanji
  r: string; // reading (hiragana)
  o?: string; // on'yomi reading
  h: string; // Han Viet reading
  m: string; // meaning (Vietnamese)
  g: number; // grade
}

type APIResponse = APIResponseItem[];

const API_BASE_URL = "http://localhost:3000/api/kanjis/search";
const SEARCHLIST_PATH = path.join(__dirname, "../data/searchlist.json");
const OUTPUT_PATH = path.join(__dirname, "../data/searchlist.json");
const BACKUP_PATH = path.join(
  __dirname,
  `../data/searchlist.backup.${Date.now()}.json`
);

// Delay để tránh spam API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchKanjiData(kanji: string): Promise<APIResponseItem | null> {
  try {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(kanji)}`;
    console.log(`Fetching: ${kanji}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error fetching ${kanji}: ${response.status}`);
      return null;
    }

    const data: APIResponse = await response.json();

    // API trả về array, lấy phần tử đầu tiên
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    console.warn(`No data returned for ${kanji}`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch ${kanji}:`, error);
    return null;
  }
}

async function updateSearchList() {
  // 1. Đọc file hiện tại
  console.log("Reading searchlist.json...");
  const fileContent = fs.readFileSync(SEARCHLIST_PATH, "utf-8");
  const searchList: SearchListItem[] = JSON.parse(fileContent);

  console.log(`Total entries: ${searchList.length}`);

  // 2. Backup file gốc
  console.log("Creating backup...");
  fs.writeFileSync(BACKUP_PATH, fileContent);
  console.log(`Backup saved to: ${BACKUP_PATH}`);

  // 3. Update từng entry
  const updatedList: SearchListItem[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < searchList.length; i++) {
    const item = searchList[i];
    console.log(`\n[${i + 1}/${searchList.length}] Processing: ${item.k}`);

    // Gọi API
    const apiData = await fetchKanjiData(item.k);

    if (apiData) {
      // Cập nhật dữ liệu
      const updatedItem: SearchListItem = {
        ...item,
        o: apiData.o || item.o, // Update on'yomi
        m: apiData.m || item.m, // Update meaning (Vietnamese)
        h: apiData.h || item.h || "", // Update Han Viet reading
      };

      updatedList.push(updatedItem);
      successCount++;
      console.log(`✓ Updated: m="${updatedItem.m}", h="${updatedItem.h}"`);
    } else {
      // Giữ nguyên data cũ nếu API fail
      updatedList.push(item);
      failCount++;
      console.log(`✗ Failed, keeping original data`);
    }

    // Delay để tránh quá tải API (50ms)
    await delay(50);

    // Lưu progress mỗi 100 entries
    if ((i + 1) % 100 === 0) {
      console.log(
        `\n--- Progress: ${i + 1}/${searchList.length} (${Math.round(((i + 1) / searchList.length) * 100)}%) ---`
      );
      console.log(`Success: ${successCount}, Failed: ${failCount}`);

      // Lưu intermediate result
      const tempPath = path.join(__dirname, `../data/searchlist.temp.json`);
      fs.writeFileSync(tempPath, JSON.stringify(updatedList, null, 2));
      console.log(`Temp file saved: ${tempPath}`);
    }
  }

  // 4. Lưu kết quả cuối cùng
  console.log("\n\nSaving final result...");
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updatedList, null, 2));

  console.log("\n=== COMPLETED ===");
  console.log(`Total processed: ${searchList.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Output saved to: ${OUTPUT_PATH}`);
  console.log(`Backup saved to: ${BACKUP_PATH}`);
}

// Run script
updateSearchList().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
