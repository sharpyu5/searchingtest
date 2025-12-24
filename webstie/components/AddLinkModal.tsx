
import React, { useState } from 'react';
import { Article, Category } from '../types';
import { classifyArticle } from '../services/geminiService';
import { X, Loader2, Wand2 } from 'lucide-react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (article: Article) => void;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [snippet, setSnippet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!title || !snippet) {
      setError('请输入文章标题和内容片段以便AI分析');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const result = await classifyArticle(title, snippet);
      
      const newArticle: Article = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        author: author || '未知作者',
        url: url || '#',
        category: result.category as Category,
        tags: result.tags,
        summary: result.summary,
        addedAt: Date.now()
      };
      
      onAdd(newArticle);
      // Reset form
      setUrl('');
      setTitle('');
      setAuthor('');
      setSnippet('');
    } catch (err) {
      console.error(err);
      setError('AI 分析失败，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">推荐专业内容</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">文章链接 (选填)</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://mp.weixin.qq.com/..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">文章标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入完整标题"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">作者/公众号</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="作者名"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">内容片段/关键点 *</label>
            <textarea
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              rows={3}
              placeholder="粘贴一段核心内容或关键点，AI将据此分类与总结"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-xs italic">{error}</p>}

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-slate-300 transition-colors shadow-lg shadow-indigo-100 mt-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在智能分析分类...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                提交并由AI智能分类
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLinkModal;
