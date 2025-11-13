'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { Sparkles, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await authApi.login(formData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'hsl(220, 26%, 6%)' }}>
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Hero Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(180deg, hsl(217, 91%, 20%) 0%, hsl(199, 89%, 20%) 50%, hsl(180, 100%, 20%) 100%)'
          }}
        />
        
        {/* Radial Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, hsl(199, 89%, 48% / 0.1), transparent 50%)'
          }}
        />
      </div>

      {/* Centered Content Area */}
      <div className="relative z-10 w-full max-w-md">
        {/* Authentication Card */}
        <div 
          className="rounded-xl p-8 backdrop-blur-xl border shadow-2xl"
          style={{
            backgroundColor: 'hsl(220, 20%, 10%)',
            borderColor: 'hsl(220, 20%, 18%)',
            boxShadow: '0 8px 32px hsl(220, 26%, 0% / 0.4)'
          }}
        >
          {/* Card Header */}
          <div className="space-y-1 mb-6">
            {/* Icon Container */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(199, 89%, 48%) 50%, hsl(180, 100%, 50%) 100%)',
                boxShadow: '0 0 60px hsl(199, 89%, 48% / 0.3)'
              }}
            >
              <Sparkles className="h-6 w-6" style={{ color: 'hsl(220, 26%, 6%)' }} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold" style={{ color: 'hsl(210, 40%, 98%)' }}>
              Welcome back
            </h1>

            {/* Description */}
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 65%)' }}>
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {errors.general && (
              <div 
                className="px-4 py-3 rounded-lg text-sm"
                style={{
                  backgroundColor: 'hsl(0, 84%, 60% / 0.1)',
                  borderColor: 'hsl(0, 84%, 60% / 0.3)',
                  borderWidth: '1px',
                  color: 'hsl(0, 84%, 60%)'
                }}
              >
                {errors.general}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium block" style={{ color: 'hsl(210, 40%, 98%)' }}>
                Email
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-3 h-4 w-4" 
                  style={{ color: 'hsl(215, 20%, 65%)' }} 
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter your email"
                  className="w-full h-10 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'hsl(220, 20%, 14%)',
                    borderColor: errors.email ? 'hsl(0, 84%, 60%)' : 'hsl(220, 20%, 18%)',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'hsl(199, 89%, 48%)';
                    e.target.style.boxShadow = '0 0 0 2px hsl(199, 89%, 48% / 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? 'hsl(0, 84%, 60%)' : 'hsl(220, 20%, 18%)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-sm" style={{ color: 'hsl(0, 84%, 60%)' }}>{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium block" style={{ color: 'hsl(210, 40%, 98%)' }}>
                  Password
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-sm hover:underline transition-all"
                  style={{ color: 'hsl(199, 89%, 48%)' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-3 h-4 w-4" 
                  style={{ color: 'hsl(215, 20%, 65%)' }} 
                />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                  className="w-full h-10 pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'hsl(220, 20%, 14%)',
                    borderColor: errors.password ? 'hsl(0, 84%, 60%)' : 'hsl(220, 20%, 18%)',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'hsl(199, 89%, 48%)';
                    e.target.style.boxShadow = '0 0 0 2px hsl(199, 89%, 48% / 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? 'hsl(0, 84%, 60%)' : 'hsl(220, 20%, 18%)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.password && (
                <p className="text-sm" style={{ color: 'hsl(0, 84%, 60%)' }}>{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(199, 89%, 48%) 50%, hsl(180, 100%, 50%) 100%)',
                color: 'hsl(220, 26%, 6%)',
                boxShadow: '0 0 60px hsl(199, 89%, 48% / 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 65%)' }}>
              Don't have an account?{' '}
              <Link 
                href="/register"
                className="font-medium hover:underline transition-all"
                style={{ color: 'hsl(199, 89%, 48%)' }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
