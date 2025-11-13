'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'hsl(220, 26%, 6%)' }}>
      <Navigation />

      {/* Full page background with overlay */}
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

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
            <span 
              className="bg-clip-text text-transparent block"
              style={{
                background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(199, 89%, 48%) 50%, hsl(180, 100%, 50%) 100%)'
              }}
            >
              AI Business Analyst
            </span>
            <span style={{ color: 'hsl(210, 40%, 98%)' }}>
              Dashboard
            </span>
          </h1>

          <p className="mb-10 text-xl" style={{ color: 'hsl(215, 20%, 65%)' }}>
            Transform your data into actionable insights
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="text-base px-8 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(199, 89%, 48%) 50%, hsl(180, 100%, 50%) 100%)',
                  color: 'hsl(220, 26%, 6%)',
                  boxShadow: '0 0 60px hsl(199, 89%, 48% / 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                style={{
                  borderColor: 'hsl(220, 20%, 18%)',
                  color: 'hsl(210, 40%, 98%)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(220, 20%, 14% / 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
