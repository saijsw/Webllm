import { useState } from 'react';
import { Code2, LogIn, LogOut, User as UserIcon, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserStore } from '../../store/userStore';
import { ProModal } from './ProModal';

export function Header() {
  const { loginWithGoogle, logout } = useAuth();
  const { user, isLoading } = useUserStore();
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  return (
    <>
      <header className="h-12 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2 text-blue-400">
          <Code2 size={20} />
          <h1 className="font-semibold text-sm tracking-wide text-gray-200">WebLLM Editor</h1>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span 
                  className="bg-[#2d2d2d] px-2 py-1 rounded-md border border-[#3c3c3c] cursor-pointer hover:bg-[#3c3c3c] transition-colors flex items-center gap-1"
                  onClick={() => !user.isPro && setIsProModalOpen(true)}
                >
                  {user.isPro ? (
                    <span className="text-yellow-500 font-bold">PRO</span>
                  ) : (
                    <>
                      <Zap size={12} className="text-yellow-500" />
                      <span>UPGRADE</span>
                    </>
                  )}
                </span>
                {!user.isPro && <span>{user.credits} Credits</span>}
              </div>
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <UserIcon size={12} className="text-white" />
                  </div>
                )}
                <button 
                  onClick={logout}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2d2d2d] rounded-md transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
            >
              <LogIn size={14} />
              Sign In
            </button>
          )}
        </div>
      </header>
      
      <ProModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />
    </>
  );
}
