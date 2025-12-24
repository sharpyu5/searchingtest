
import React, { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    // 模拟后台验证过程
    setTimeout(() => {
      if (password === 'admin888') { // 演示默认密码
        onLogin();
        setPassword('');
        onClose();
      } else {
        setError('密码错误，请重试');
      }
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            后台系统登录
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">请输入管理员密码以开启内容管理功能</p>
          <div>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="管理员密码"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-rose-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : '立即进入'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
