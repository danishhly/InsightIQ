'use client';

import { Card } from '@/components/ui/card';
import { BarChart3, Upload, Lightbulb, Database } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Datasets', value: '0', icon: Database, color: 'bg-blue-500' },
    { label: 'Charts', value: '0', icon: BarChart3, color: 'bg-green-500' },
    { label: 'Insights', value: '0', icon: Lightbulb, color: 'bg-yellow-500' },
    { label: 'Uploads', value: '0', icon: Upload, color: 'bg-purple-500' },
  ];

  const quickActions = [
    { href: '/data/upload', label: 'Upload Data', description: 'Upload CSV or Excel files' },
    { href: '/charts', label: 'Create Chart', description: 'Visualize your data' },
    { href: '/insights', label: 'View Insights', description: 'See AI-generated insights' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to InsightIQ</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-gray-900 mb-2">{action.label}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <p className="text-gray-600">No recent activity. Start by uploading your first dataset!</p>
      </Card>
    </div>
  );
}

