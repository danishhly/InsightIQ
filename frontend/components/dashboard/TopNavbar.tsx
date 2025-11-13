'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { Bell, Search, Calendar } from 'lucide-react';

export function TopNavbar() {
  const user = useAuthStore((state) => state.user);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-[#1a1a2e] border-b border-[#2a2a3e] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0a0b0] w-5 h-5" />
            <input
              type="text"
              placeholder="Search datasets, charts, insights..."
              className="w-full pl-10 pr-4 py-2 bg-[#0f0f23] border border-[#2a2a3e] rounded-lg text-white placeholder-[#a0a0b0] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Date */}
          <div className="flex items-center space-x-2 text-[#a0a0b0]">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{currentDate}</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-[#a0a0b0] hover:text-white hover:bg-[#0f0f23] rounded-lg transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-[#2a2a3e]">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
