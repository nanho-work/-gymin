"use client";

import { parseWorkDayCodes, toggleWorkDay, weekdayOptions } from "@/shared/utils/weekdays";
import type { WeekdayCode } from "@/shared/utils/weekdays";

export function WeekdaySelector({
  label = "근무 요일",
  onChange,
  value
}: {
  label?: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const selectedCodes = parseWorkDayCodes(value);

  const handleToggle = (day: WeekdayCode) => {
    onChange(toggleWorkDay(value, day));
  };

  return (
    <div className="block">
      <p className="text-sm font-black text-ink">{label}</p>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {weekdayOptions.map((day) => {
          const isSelected = selectedCodes.includes(day.value);

          return (
            <button
              aria-pressed={isSelected}
              className={`h-11 border text-sm font-black transition ${
                isSelected
                  ? "border-green bg-green text-white"
                  : "border-line bg-white text-muted hover:border-green hover:text-ink"
              }`}
              key={day.value}
              onClick={() => handleToggle(day.value)}
              type="button"
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
