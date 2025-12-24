
import React, { useState, useMemo, useEffect } from 'react';
import { Article, DEFAULT_CATEGORIES } from './types';
import { INITIAL_ARTICLES } from './constants';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import FilterBar from './components/FilterBar';
import AddLinkModal from './components/AddLinkModal';
import AdminLoginModal from './components/AdminLoginModal';
import CategoryManagerModal from './components/CategoryManagerModal';
import { Plus, ShieldCheck, CheckCircle2, AlertCircle, ListPlus } from 'lucide-react';

const STORAGE_KEY_ARTICLES = 'wecurate_articles_db_v3';
const STORAGE_KEY_CATS = 'wecurate_categories_db_v3';

const App: React.FC = () => {
  // 分类状态
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATS);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // 文章状态
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_ARTICLES; }
    }
    return INITIAL_ARTICLES;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(categories));
  }, [categories]);

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
    setArticles(articles.filter(article => article.id !== id));
    showToast('内容已从资料库移除');
  };

  const handleAddCategory = (newCat: string) => {
    if (categories.includes(newCat)) return;
    setCategories([...categories, newCat]);
    showToast(`分类 "${newCat}" 已添加`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (catToDelete === '其他') {
      showToast('默认分类不可删除', 'error');
      return;
    }
    setCategories(categories.filter(c => c !== catToDelete));
    // 将被删除分类下的文章重置为“其他”
    setArticles(articles.map(a => a.category === catToDelete ? { ...a, category: '其他' } : a));
    if (selectedCategory === catToDelete) setSelectedCategory('全部');
    showToast(`分类 "${catToDelete}" 已移除`);
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
              {isAdmin && <ShieldCheck className="w-5 h-5 text-amber-500" />}
              {isAdmin ? '内容管理系统' : '精选专业内容'}
            </h2>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsCatModalOpen(true)}
                className="flex items-center gap-1 px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
              >
                <ListPlus className="w-4 h-4" />
                管理分类
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus className="w-4 h-4" />
                添加推荐
              </button>
            </div>
          )}
        </div>

        <FilterBar 
          categories={categories}
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

      <AddLinkModal 
        isOpen={isAddModalOpen} 
        categories={categories}
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddArticle}
      />

      <CategoryManagerModal 
        isOpen={isCatModalOpen}
        categories={categories}
        onClose={() => setIsCatModalOpen(false)}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
      />

      <AdminLoginModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={() => {
          setIsAdmin(true);
          showToast('成功登录管理后台');
        }}
      />

      {/* Mobile Footer */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-around md:hidden z-40">
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <Plus className="w-6 h-6" />
          <span className="text-[10px] font-medium">发现</span>
        </button>
        {isAdmin && (
          <>
            <button onClick={() => setIsCatModalOpen(true)} className="flex flex-col items-center gap-1 text-slate-400">
              <ListPlus className="w-6 h-6" />
              <span className="text-[10px] font-medium">分类</span>
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="flex flex-col items-center gap-1 text-indigo-600">
              <Plus className="w-6 h-6" />
              <span className="text-[10px] font-medium">添加</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default App;
