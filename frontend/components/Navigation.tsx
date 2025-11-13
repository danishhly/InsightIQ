'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl" style={{ 
      backgroundColor: 'hsl(220, 20%, 10% / 0.8)',
      borderColor: 'hsl(220, 20%, 18%)'
    }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(199, 89%, 48%) 50%, hsl(180, 100%, 50%) 100%)'
            }}
          >
            <Brain className="w-6 h-6" style={{ color: 'hsl(220, 26%, 6%)' }} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            InsightIQ
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            href="/features" 
            className="text-sm hover:underline transition-all"
            style={{ color: 'hsl(215, 20%, 65%)' }}
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            className="text-sm hover:underline transition-all"
            style={{ color: 'hsl(215, 20%, 65%)' }}
          >
            Pricing
          </Link>
          <Link 
            href="/about" 
            className="text-sm hover:underline transition-all"
            style={{ color: 'hsl(215, 20%, 65%)' }}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

