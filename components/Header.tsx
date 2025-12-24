
import React from 'react';
import { Search, Globe, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isAdmin, onAdminClick, onLogout }) => {
  return (
    <header className={`sticky top-0 z-40 bg-white border-b transition-colors duration-300 ${isAdmin ? 'border-amber-200 shadow-sm' : 'border-slate-200'}`}>
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors ${isAdmin ? 'bg-amber-500' : 'bg-indigo-600'}`}>
            <Globe className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-900">WeCurate</h1>
            {isAdmin && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">管理后台</span>}
          </div>
        </div>

        <div className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="搜索专业内容、作者、标签..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              title="退出管理"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={onAdminClick}
              className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
              title="后台管理"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
