
import React from 'react';
import { Article } from '../types';
import { getCategoryColor } from '../constants';
import { ExternalLink, Tag, User, Trash2 } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onDelete: () => void;
  isAdmin: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onDelete, isAdmin }) => {
  const colorClass = getCategoryColor(article.category);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('确定要从资料库中永久删除这篇文章吗？')) {
      onDelete();
    }
  };

  return (
    <div className={`bg-white p-5 rounded-2xl border mini-program-shadow hover:shadow-lg transition-all group flex flex-col h-full relative ${isAdmin ? 'border-amber-100 hover:border-amber-400 ring-1 ring-transparent hover:ring-amber-200' : 'border-slate-100'}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${colorClass}`}>
          {article.category}
        </span>
        <div className="flex items-center gap-3">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {isAdmin && (
            <button 
              onClick={handleDeleteClick}
              className="text-slate-300 hover:text-rose-500 transition-all p-1.5 rounded-lg hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
        {article.title}
      </h3>
      
      <p className="text-slate-500 text-xs mb-4 line-clamp-3 leading-relaxed flex-grow">
        {article.summary}
      </p>

      <div className="pt-3 border-t border-slate-50 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="w-3 h-3 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-600 truncate">{article.author}</span>
        </div>
        <div className="flex gap-1 overflow-hidden">
          {article.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <Tag className="w-2 h-2" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
