'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const response = await authApi.register({ email, password, name });
        setAuth(response.user, response.accessToken, response.refreshToken);
      } else {
        const response = await authApi.login({ email, password });
        setAuth(response.user, response.accessToken, response.refreshToken);
      }
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 
        (isSignUp ? 'Registration failed' : 'Login failed');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    router.push(newMode ? '/?mode=signup' : '/');
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'hsl(220, 26%, 6%)' }}>
      <Navigation />

      {/* Full page background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'linear-gradient(180deg, hsl(217, 91%, 20%) 0%, hsl(199, 89%, 20%) 50%, hsl(180, 100%, 20%) 100%)'
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, hsl(199, 89%, 48% / 0.1), transparent 50%)'
        }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 pt-16">
        <Card className="relative w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div 
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(199, 89%, 48%) 50%, hsl(180, 100%, 50%) 100%)',
                boxShadow: '0 0 60px hsl(199, 89%, 48% / 0.3)'
              }}
            >
              <Sparkles className="h-6 w-6" style={{ color: 'hsl(220, 26%, 6%)' }} />
            </div>
            <CardTitle>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Start your free trial today. No credit card required.'
                : 'Enter your credentials to access your account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div 
                  className="px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'hsl(0, 84%, 60% / 0.1)',
                    borderColor: 'hsl(0, 84%, 60% / 0.3)',
                    borderWidth: '1px',
                    color: 'hsl(0, 84%, 60%)'
                  }}
                >
                  {error}
                </div>
              )}

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User 
                      className="absolute left-3 top-3 h-4 w-4" 
                      style={{ color: 'hsl(215, 20%, 65%)' }} 
                    />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-3 h-4 w-4" 
                    style={{ color: 'hsl(215, 20%, 65%)' }} 
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-3 h-4 w-4" 
                    style={{ color: 'hsl(215, 20%, 65%)' }} 
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={isSignUp ? 6 : undefined}
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="text-sm hover:underline transition-all"
                    style={{ color: 'hsl(199, 89%, 48%)' }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                variant="primary"
              >
                {isLoading ? (
                  'Loading...'
                ) : isSignUp ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span style={{ color: 'hsl(215, 20%, 65%)' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>{' '}
              <button
                onClick={toggleMode}
                className="hover:underline font-medium transition-all"
                style={{ color: 'hsl(199, 89%, 48%)' }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

