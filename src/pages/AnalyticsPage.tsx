import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { BarChart2, TrendingUp, Clock, Flame } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function AnalyticsPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ notes: 0, tasks: 0, messages: 0 });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      // Mock stats
      setStats({
        notes: 12,
        tasks: 5,
        messages: 34
      });
    }
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Analytics</h1>
        <p className="text-[var(--color-text-body)]">Track your study progress and habits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[rgba(139,92,246,0.1)] text-[var(--color-accent)]">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--color-text-meta)] uppercase tracking-wider">Current Streak</div>
              <div className="text-2xl font-bold text-white">3 Days</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.1)] text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--color-text-meta)] uppercase tracking-wider">Study Time</div>
              <div className="text-2xl font-bold text-white">12.5 hrs</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.1)] text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--color-text-meta)] uppercase tracking-wider">Notes Created</div>
              <div className="text-2xl font-bold text-white">{stats.notes}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)] text-amber-400">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--color-text-meta)] uppercase tracking-wider">Tasks Done</div>
              <div className="text-2xl font-bold text-white">{stats.tasks}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 min-h-[400px] flex items-center justify-center border-dashed border-2 bg-[rgba(255,255,255,0.01)]">
        <div className="text-center text-[var(--color-text-meta)]">
          <BarChart2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Detailed charts will appear here as you log more study sessions.</p>
        </div>
      </Card>
    </div>
  );
}
