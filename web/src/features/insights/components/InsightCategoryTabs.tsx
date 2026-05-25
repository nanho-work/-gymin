import type { InsightCategory, InsightCategoryId } from "@/features/insights/types";

type InsightCategoryTabsProps = {
  activeCategory: InsightCategoryId;
  categories: InsightCategory[];
  onCategoryChange: (category: InsightCategoryId) => void;
};

export function InsightCategoryTabs({ activeCategory, categories, onCategoryChange }: InsightCategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const isActive = category.id === activeCategory;

        return (
          <button
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
              isActive
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-muted hover:border-neutral-400 hover:text-ink"
            }`}
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            type="button"
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
