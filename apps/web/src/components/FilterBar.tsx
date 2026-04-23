import { CATEGORIES, type Category } from '../types/event';

interface FilterBarProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export default function FilterBar({ activeCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="border-b border-white/5 bg-slate-950/40">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 scrollbar-hide">
        {CATEGORIES.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-linear-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'border border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-200'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
