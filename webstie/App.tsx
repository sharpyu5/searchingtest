
import React, { useState, useMemo, useEffect } from 'react';
import { Category, Article } from './types';
import { INITIAL_ARTICLES } from './constants';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import FilterBar from './components/FilterBar';
import AddLinkModal from './components/AddLinkModal';
import AIAssistant from './components/AIAssistant';
import AdminLoginModal from './components/AdminLoginModal';
import { Plus, Sparkles, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'wecurate_articles_db_v2';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ARTICLES;
      }
    }
    return INITIAL_ARTICLES;
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | '全部'>('全部');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const handleAddArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
    setIsAddModalOpen(false);
    showToast('内容已成功添加到资料库');
  };

  const handleDeleteArticle = (id: string) => {
    // 这里的 id 已经是 ArticleCard 传递过来的确认要删除的 id
    const updatedArticles = articles.filter(article => article.id !== id);
    setArticles(updatedArticles);
    showToast('内容已从资料库移除');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20 md:pb-0 ${isAdmin ? 'bg-slate-100' : 'bg-slate-50'}`}>
      <Header 
        onSearch={setSearchQuery} 
        isAdmin={isAdmin}
        onAdminClick={() => setIsAdminModalOpen(true)}
        onLogout={() => {
          setIsAdmin(false);
          showToast('已退出管理后台');
        }}
      />
      
      <main className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {isAdmin ? <ShieldCheck className="w-5 h-5 text-amber-500" /> : <Sparkles className="w-5 h-5 text-indigo-500" />}
              {isAdmin ? '内容管理系统' : '精选专业内容'}
            </h2>
            {isAdmin && <p className="text-[10px] text-amber-600 font-medium">您现在拥有编辑与删除权限</p>}
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              添加推荐
            </button>
          )}
        </div>

        <FilterBar 
          selected={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                isAdmin={isAdmin}
                onDelete={() => handleDeleteArticle(article.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400">暂无内容，请尝试切换分类或搜索</p>
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium border ${
            toast.type === 'success' ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-white text-rose-600 border-rose-100'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-xl border border-indigo-50 hover:bg-indigo-50 transition-all group"
        >
          <MessageSquare className={`w-6 h-6 transition-transform ${isChatOpen ? 'rotate-90' : ''}`} />
          <span className="absolute right-16 px-3 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
            AI 专家解答
          </span>
        </button>
      </div>

      <AddLinkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddArticle}
      />

      <AdminLoginModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={() => {
          setIsAdmin(true);
          showToast('成功登录管理后台');
        }}
      />

      <AIAssistant 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        articles={articles}
      />

      {/* Footer Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-around md:hidden z-40">
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <Sparkles className="w-6 h-6" />
          <span className="text-[10px] font-medium">发现</span>
        </button>
        {isAdmin ? (
          <button onClick={() => setIsAddModalOpen(true)} className="flex flex-col items-center gap-1 text-indigo-600">
            <Plus className="w-6 h-6" />
            <span className="text-[10px] font-medium">添加</span>
          </button>
        ) : (
          <button onClick={() => setIsAdminModalOpen(true)} className="flex flex-col items-center gap-1 text-slate-400">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-[10px] font-medium">后台</span>
          </button>
        )}
        <button onClick={() => setIsChatOpen(true)} className="flex flex-col items-center gap-1 text-slate-400">
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] font-medium">AI问答</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
