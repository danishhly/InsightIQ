'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { 
  LayoutDashboard, 
  Upload, 
  Table, 
  BarChart3, 
  Lightbulb, 
  LogOut,
  Settings,
  HelpCircle,
  Brain
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/data/upload', label: 'Upload Data', icon: Upload },
  { href: '/data/tables', label: 'Data Tables', icon: Table },
  { href: '/charts', label: 'Charts', icon: BarChart3 },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-[#0a0a1a] text-white min-h-screen flex flex-col border-r border-[#1a1a2e]">
      {/* Logo */}
      <div className="p-6 border-b border-[#1a1a2e]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              InsightIQ
            </h1>
            <p className="text-xs text-[#a0a0b0] mt-0.5">AI-Powered Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#1a1a2e] text-white shadow-lg shadow-indigo-500/20'
                  : 'text-[#a0a0b0] hover:bg-[#1a1a2e] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#1a1a2e] space-y-1">
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#a0a0b0] hover:bg-[#1a1a2e] hover:text-white transition-all"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <Link
          href="/help"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#a0a0b0] hover:bg-[#1a1a2e] hover:text-white transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Help Center</span>
        </Link>
        
        {/* User Info */}
        <div className="px-4 py-3 mt-2 border-t border-[#1a1a2e]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-[#a0a0b0] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-[#a0a0b0] hover:bg-[#1a1a2e] hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
