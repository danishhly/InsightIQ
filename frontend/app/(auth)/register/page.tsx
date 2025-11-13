'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { Brain, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await authApi.register(formData);
      setAuth(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Registration failed';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[#1a1a2e]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-black" />
          </div>
          <span className="text-white text-xl font-semibold">InsightIQ</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-[#a0a0b0] hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/platform" className="text-[#a0a0b0] hover:text-white transition-colors">
            Platform
          </Link>
          <Link href="/about" className="text-[#a0a0b0] hover:text-white transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-[#a0a0b0] hover:text-white transition-colors">
            Login
          </Link>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Zap className="w-4 h-4 mr-2" />
            Join Free Beta
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* New Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-[#1a1a2e] px-4 py-2 rounded-full border border-[#2a2a3e]">
              <span className="text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                New
              </span>
              <span className="text-xs text-[#a0a0b0]">Free beta now available</span>
            </div>
          </div>

          {/* Gradient Card */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Get started with InsightIQ
                </h1>
                <p className="text-lg text-white/90">
                  Create your account and start analyzing data
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                    {errors.general}
                  </div>
                )}

                <div>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    required
                    placeholder="Email address"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                    required
                    placeholder="Password"
                    minLength={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 text-lg border-0"
                >
                  {!isLoading && (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Get Free Beta
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-white/80 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-white font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-8 border-t border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[#a0a0b0] text-xs mb-6">BACKED BY THE BEST</p>
          <div className="flex items-center justify-center space-x-8 flex-wrap gap-4">
            <span className="text-white font-bold text-sm">FOX</span>
            <span className="text-white font-semibold text-sm">DIGITAL JOURNAL</span>
            <span className="text-white font-semibold text-sm">MarketWatch</span>
            <span className="text-white font-semibold text-sm">BENZINGA</span>
            <span className="text-white font-semibold text-xs">azcentral.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
