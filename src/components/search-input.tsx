"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import searchlist from "@/../data/searchlist.json";
import composition from "@/../data/composition.json";

const OPTIONS: SearchOption[] = searchlist.map((el) => {
  return {
    kanji: el.k,
    kunyomi: el.r,
    meaning: el.m,
    yinhan: el.h,
    group:
      el.g === 1
        ? "Kanji thông dụng"
        : el.g === 2
          ? "Kanji dùng cho tên người"
          : "Hiếm gặp, văn tự",
  };
});

type SearchOption = {
  kanji: string;
  kunyomi: string;
  meaning: string;
  yinhan?: string;
  group: "Kanji thông dụng" | "Kanji dùng cho tên người" | "Hiếm gặp, văn tự";
};

interface VirtualizedCommandProps {
  height: string;
  options: SearchOption[];
  placeholder: string;
  selectedOption: SearchOption | null;
  onSelectOption?: (option: SearchOption) => void;
  width?: string;
}

const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  selectedOption,
  onSelectOption,
  width,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<SearchOption[]>(options);

  const handleSearch = (search: string) => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.kanji.toLowerCase().includes(search.toLowerCase()) ||
          option.kunyomi.toLowerCase().includes(search.toLowerCase()) ||
          option.meaning.toLowerCase().includes(search.toLowerCase()) ||
          (option.yinhan &&
            option.yinhan.toLowerCase().includes(search.toLowerCase()))
      )
    );
  };

  const flattenedOptions = React.useMemo(() => {
    const groups: { [key: string]: SearchOption[] } = {
      "Kanji thông dụng": [],
      "Kanji dùng cho tên người": [],
      "Hiếm gặp, văn tự": [],
    };

    filteredOptions.forEach((option) => {
      if (groups[option.group]) {
        groups[option.group].push(option);
      }
    });

    const flatList: { type: "group" | "item"; value: any }[] = [];

    Object.entries(groups).forEach(([groupName, groupOptions]) => {
      if (groupOptions.length > 0) {
        flatList.push({ type: "group", value: groupName });
        groupOptions.forEach((option) =>
          flatList.push({ type: "item", value: option })
        );
      }
    });

    return flatList;
  }, [filteredOptions]);

  return (
    <Command shouldFilter={false} style={width ? { width } : undefined}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandList style={{ height, width, overflow: "auto" }}>
        {flattenedOptions.length === 0 ? (
          <CommandEmpty>Không có kết quả nào.</CommandEmpty>
        ) : (
          <Virtuoso
            data={flattenedOptions}
            itemContent={(index, data) =>
              data.type === "group" ? (
                <div className="text-foreground/50 z-10 p-1 pl-2 text-sm">
                  {data.value}
                </div>
              ) : (
                <CommandItem
                  key={data.value.kanji}
                  value={data.value.kanji}
                  onSelect={() => onSelectOption?.(data.value)}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold">{data.value.kanji}</div>

                    <div className="text-xs">
                      <div>{data.value.kunyomi}</div>
                      {data.value.yinhan && (
                        <div className="text-primary font-semibold">
                          {data.value.yinhan}
                        </div>
                      )}
                      <div>{data.value.meaning}</div>
                    </div>
                  </div>
                </CommandItem>
              )
            }
            style={{ height }}
          />
        )}
      </CommandList>
    </Command>
  );
};

interface SearchInputProps {
  searchPlaceholder?: string;
  className?: string;
  popoverHeight?: string; // Height of dropdown, default "215px"
  popoverWidth?: string; // Width of dropdown
  fullWidth?: boolean; // Use full width of trigger button
}

export const SearchInput = ({
  searchPlaceholder = "Search kanji...",
  className = "",
  popoverHeight = "215px",
  popoverWidth = "220px",
  fullWidth = false,
}: SearchInputProps) => {
  const router = useRouter();

  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedOption, setSelectedOption] =
    React.useState<SearchOption | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedOption ? `${selectedOption.kanji}` : searchPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{
          width: fullWidth
            ? "var(--radix-popover-trigger-width)"
            : popoverWidth,
        }}
      >
        <VirtualizedCommand
          height={popoverHeight}
          width={
            fullWidth ? "var(--radix-popover-trigger-width)" : popoverWidth
          }
          options={OPTIONS}
          placeholder={searchPlaceholder}
          selectedOption={selectedOption}
          onSelectOption={(currentValue) => {
            setSelectedOption(currentValue);
            setOpen(false);
            // Only navigate if kanji exists in composition
            if (currentValue.kanji in composition) {
              router.push(`/${currentValue.kanji}`);
            } else {
              console.warn(
                `Kanji "${currentValue.kanji}" not found in composition`
              );
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
