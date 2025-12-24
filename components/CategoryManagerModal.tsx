
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: string[];
  onClose: () => void;
  onAdd: (cat: string) => void;
  onDelete: (cat: string) => void;
}

const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, categories, onClose, onAdd, onDelete }) => {
  const [newCat, setNewCat] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onAdd(trimmed);
      setNewCat('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">分类管理</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="新增分类名称..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAdd}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {categories.map(cat => (
              <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                <span className="text-sm font-medium text-slate-700">{cat}</span>
                {cat !== '其他' && (
                  <button
                    onClick={() => onDelete(cat)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-slate-400 mt-4 text-center">
            删除分类会将该分类下的文章移动到 "其他"
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagerModal;
