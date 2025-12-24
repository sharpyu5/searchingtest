
import React from 'react';
import { Category } from '../types';

interface FilterBarProps {
  selected: Category | '全部';
  onSelect: (cat: Category | '全部') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selected, onSelect }) => {
  const categories = ['全部', ...Object.values(Category)];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat as Category | '全部')}
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
