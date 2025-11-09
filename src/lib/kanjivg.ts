/**
 * KanjiVG SVG loader utility
 * Loads stroke order SVG files from KanjiVG GitHub repository
 * https://github.com/KanjiVG/kanjivg
 */

/**
 * Convert kanji character to KanjiVG filename format
 * Example: "水" -> "06c34.svg"
 */
export function kanjiToKanjiVGFilename(kanji: string): string {
  const unicode = kanji.charCodeAt(0).toString(16).padStart(5, "0");
  return `${unicode}.svg`;
}

/**
 * Load KanjiVG SVG from GitHub CDN (jsDelivr for better performance)
 * Falls back to raw GitHub if CDN fails
 */
export async function loadKanjiVGSvg(kanji: string): Promise<string | null> {
  const filename = kanjiToKanjiVGFilename(kanji);

  // Try jsDelivr CDN first (faster and more reliable)
  const cdnUrl = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${filename}`;

  try {
    const response = await fetch(cdnUrl, {
      // Cache for 1 hour in browser, revalidate after 1 day
      next: { revalidate: 86400 },
    });

    if (response.ok) {
      const svgText = await response.text();
      return svgText;
    }
  } catch (error) {
    console.warn(`Failed to load from CDN for ${kanji}:`, error);
  }

  // Fallback to raw GitHub
  const githubUrl = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${filename}`;

  try {
    const response = await fetch(githubUrl, {
      next: { revalidate: 86400 },
    });

    if (response.ok) {
      const svgText = await response.text();
      return svgText;
    }
  } catch (error) {
    console.error(`Failed to load KanjiVG SVG for ${kanji}:`, error);
  }

  return null;
}

/**
 * Prepare KanjiVG SVG for kanjivganimate library
 * Adds required class and ensures proper stroke styling
 */
export function prepareKanjiVGForAnimation(
  svgText: string,
  size?: number
): string {
  // Remove DOCTYPE declaration and DTD (causes rendering issues)
  let cleanedSvg = svgText.replace(/<!DOCTYPE[^>]*(\[[\s\S]*?\])?>/gi, "");

  // Set default size if not provided
  const svgSize = size || 109;

  // Add class "kanjiVG" for kanjivganimate and set size
  // Ensure stroke paths have proper styling (keep existing if present)
  const modifiedSvg = cleanedSvg
    .replace(
      /<svg/,
      `<svg class="kanjiVG" width="${svgSize}" height="${svgSize}"`
    )
    .replace(/]>/, "")
    .replace(
      /style="fill:none;stroke:#000000;/g,
      'style="fill:none;stroke:#000;'
    )
    .trim();

  return modifiedSvg;
}

/**
 * All-in-one: Load and prepare KanjiVG SVG for animation
 */
export async function getKanjiVGForAnimation(
  kanji: string,
  size?: number
): Promise<string | null> {
  const svgText = await loadKanjiVGSvg(kanji);

  if (!svgText) {
    return null;
  }

  return prepareKanjiVGForAnimation(svgText, size);
}
