
import React from 'react';

interface FilterBarProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, selected, onSelect }) => {
  const allCats = ['全部', ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
      {allCats.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
            selected === cat
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
