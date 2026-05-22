"use client";

import regionData from "@/shared/data/regions.json";

type Region = {
  name: string;
  children: string[];
};

type RegionValue = {
  sido: string;
  sigungu: string;
};

const regions = regionData as Region[];

export function getDefaultRegionValue(): RegionValue {
  const firstRegion = regions[0];
  return {
    sido: firstRegion?.name ?? "",
    sigungu: firstRegion?.children[0] ?? ""
  };
}

export function RegionSelect({
  disabled = false,
  onChange,
  required = false,
  value
}: {
  disabled?: boolean;
  onChange: (value: RegionValue) => void;
  required?: boolean;
  value: RegionValue;
}) {
  const selectedRegion = regions.find((region) => region.name === value.sido);
  const sigunguOptions = selectedRegion?.children ?? [];
  const sigunguLabel = value.sido.includes("특별시") || value.sido.includes("광역시") ? "구/군" : "시/군";
  const requiredText = required ? " (지원 필수)" : "";

  const inputClassName =
    "mt-2 h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green disabled:bg-paper disabled:text-muted";

  return (
    <>
      <label className="block">
        <span className="text-sm font-black text-ink">시/도{requiredText}</span>
        <select
          className={inputClassName}
          disabled={disabled}
          onChange={(event) => onChange({ sido: event.target.value, sigungu: "" })}
          value={value.sido}
        >
          <option value="">선택</option>
          {regions.map((region) => (
            <option key={region.name} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-black text-ink">
          {sigunguLabel}
          {requiredText}
        </span>
        <select
          className={inputClassName}
          disabled={disabled || !value.sido}
          onChange={(event) => onChange({ sido: value.sido, sigungu: event.target.value })}
          value={value.sigungu}
        >
          <option value="">선택</option>
          {sigunguOptions.map((sigungu) => (
            <option key={sigungu} value={sigungu}>
              {sigungu}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
