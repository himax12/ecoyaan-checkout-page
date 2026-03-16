'use client';

import { useAuth } from '@/context/AuthContext';

export function UserBadge() {
  const { user, isLoggedIn, logout, login } = useAuth();

  if (!isLoggedIn) {
    return (
      <button
        onClick={login}
        className="flex items-center gap-2 text-sm text-[#10b981] font-semibold hover:underline"
      >
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs font-bold shadow-sm">
          {user!.avatarInitials}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{user!.name}</p>
          <p className="text-xs text-gray-500 leading-tight">{user!.email}</p>
        </div>
      </div>
      <button
        onClick={logout}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-300 rounded px-2 py-1"
      >
        Sign out
      </button>
    </div>
  );
}
