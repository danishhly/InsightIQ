'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, Upload, Lightbulb, Database, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { dataApi } from '@/lib/api/data';
import { chartsApi } from '@/lib/api/charts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    datasets: 0,
    charts: 0,
    insights: 0,
    uploads: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [datasets, charts] = await Promise.all([
        dataApi.getDatasets().catch(() => []),
        chartsApi.getCharts().catch(() => []),
      ]);
      
      setStats({
        datasets: datasets.length,
        charts: charts.length,
        insights: 0, // TODO: Add insights API
        uploads: datasets.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const kpiCards = [
    {
      label: 'Total Datasets',
      value: stats.datasets.toString(),
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      change: '+12.5%',
      changeType: 'up' as const,
    },
    {
      label: 'Total Charts',
      value: stats.charts.toString(),
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      change: '+8.2%',
      changeType: 'up' as const,
    },
    {
      label: 'AI Insights',
      value: stats.insights.toString(),
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      change: '-4.3%',
      changeType: 'down' as const,
    },
    {
      label: 'Data Uploads',
      value: stats.uploads.toString(),
      icon: Upload,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      change: '+2.1%',
      changeType: 'up' as const,
    },
  ];

  const quickActions = [
    { href: '/data/upload', label: 'Upload Data', description: 'Upload CSV or Excel files', icon: Upload },
    { href: '/charts', label: 'Create Chart', description: 'Visualize your data', icon: BarChart3 },
    { href: '/insights', label: 'View Insights', description: 'See AI-generated insights', icon: Lightbulb },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[#a0a0b0]">Welcome back! Here's what's happening with your data.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 hover:border-indigo-500/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-br ${kpi.color} bg-clip-text text-transparent`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  kpi.changeType === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {kpi.changeType === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div>
                <p className="text-[#a0a0b0] text-sm mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-white">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="font-semibold text-white">{action.label}</h3>
                  </div>
                  <p className="text-sm text-[#a0a0b0]">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-[#a0a0b0]">No recent activity. Start by uploading your first dataset!</p>
          <Link href="/data/upload">
            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
              Upload Dataset
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
