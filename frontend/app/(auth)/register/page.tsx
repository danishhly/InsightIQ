'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { 
  Brain, 
  Zap, 
  BarChart3, 
  Sparkles, 
  Database,
  ArrowRight,
  Check,
  Shield,
  TrendingUp,
  Rocket
} from 'lucide-react';
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

  const features = [
    { icon: Sparkles, text: 'AI-Powered Insights', desc: 'Get intelligent recommendations' },
    { icon: BarChart3, text: 'Advanced Analytics', desc: 'Visualize data like never before' },
    { icon: Database, text: 'Real-time Processing', desc: 'Instant data updates' },
    { icon: Shield, text: 'Enterprise Security', desc: 'Bank-level encryption' },
  ];

  const benefits = [
    '14-day free trial',
    'No credit card required',
    'Cancel anytime',
    '24/7 support',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0f0f23] to-[#1a1a2e] flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              InsightIQ
            </span>
          </div>

          {/* Main Content */}
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                <Rocket className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-indigo-300">Start Your Free Trial Today</span>
              </div>
              
              <h1 className="text-5xl font-bold leading-tight">
                Start Your Journey to
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Data Excellence
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Join thousands of teams using InsightIQ to make smarter decisions. Get started in minutes with our AI-powered analytics platform.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-gray-300 group-hover:text-white transition-colors font-medium">{feature.text}</div>
                      <div className="text-sm text-gray-500">{feature.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Benefits */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-300 font-semibold">
                <Zap className="w-5 h-5" />
                <span>What's Included</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50M+</div>
                <div className="text-sm text-gray-400">Data Points</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-400">
            <p>Trusted by leading companies worldwide</p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                InsightIQ
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-[#2a2a3e] rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
                <p className="text-gray-400">Start your free trial today. No credit card required.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {errors.general && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>{errors.general}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-[#0f0f23] border-[#2a2a3e] text-white placeholder:text-gray-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    required
                    placeholder="you@company.com"
                    className="bg-[#0f0f23] border-[#2a2a3e] text-white placeholder:text-gray-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="bg-[#0f0f23] border-[#2a2a3e] text-white placeholder:text-gray-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 rounded border-[#2a2a3e] bg-[#0f0f23] text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant="primary"
                  className="w-full py-3 text-base font-semibold"
                >
                  {!isLoading && (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2a2a3e]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1a1a2e] text-gray-400">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#0f0f23] border border-[#2a2a3e] rounded-lg text-gray-300 hover:border-indigo-500/50 hover:text-white transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#0f0f23] border border-[#2a2a3e] rounded-lg text-gray-300 hover:border-indigo-500/50 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center text-sm text-gray-500 space-x-4">
            <Link href="/terms" className="hover:text-gray-400">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
            <Link href="/support" className="hover:text-gray-400">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
