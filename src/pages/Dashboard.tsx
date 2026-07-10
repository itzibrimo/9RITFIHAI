import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Plus, ScanLine, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { useAuthStore } from '../store/useAuthStore';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const mockMeals = [
  { id: '1', name: 'Greek Yogurt Bowl', type: 'Breakfast', calories: 320, protein: 24, time: '8:30 AM' },
  { id: '2', name: 'Grilled Salmon Salad', type: 'Lunch', calories: 485, protein: 38, time: '12:45 PM' },
  { id: '3', name: 'Almond & Berry Mix', type: 'Snack', calories: 180, protein: 6, time: '3:15 PM' },
];

const weeklyData = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    day: d.toLocaleDateString(undefined, { weekday: 'short' }),
    calories: 1600 + Math.round(Math.random() * 600),
    target: 2200,
  };
});

export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
    else if (hour >= 17) setGreeting('Good evening');
  }, []);

  const totalCalories = mockMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = mockMeals.reduce((s, m) => s + m.protein, 0);
  const calorieTarget = 2200;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        badge="Today"
        title={`${greeting}, ${user?.displayName?.split(' ')[0] || 'there'}.`}
        subtitle="You're on track. 985 calories remaining for today."
        action={
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => navigate('/app/scanner')}>
              <ScanLine className="w-4 h-4" />
              Scan
            </Button>
            <Button size="sm" onClick={() => navigate('/app/meals')}>
              <Plus className="w-4 h-4" />
              Log meal
            </Button>
          </div>
        }
      />

      {/* Macro overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverEffect glow className="md:col-span-1 flex flex-col items-center py-8">
          <ProgressRing
            value={totalCalories}
            max={calorieTarget}
            label={`${totalCalories}`}
            sublabel="Calories"
            size={160}
          />
          <p className="text-[13px] text-[var(--color-text-meta)] mt-4">
            {calorieTarget - totalCalories} kcal remaining
          </p>
        </Card>

        <Card hoverEffect className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-light text-[var(--color-text-page-title)]">Weekly intake</h3>
            <Badge variant="accent">
              <TrendingUp className="w-3 h-3" />
              On track
            </Badge>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-text-meta)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-meta)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15,15,18,0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="calories" stroke="var(--color-accent)" fill="url(#calGradient)" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="var(--color-accent-gold)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Protein', value: totalProtein, unit: 'g', target: 150, color: 'var(--color-accent)' },
          { label: 'Carbs', value: 142, unit: 'g', target: 250, color: 'var(--color-accent-gold)' },
          { label: 'Fat', value: 48, unit: 'g', target: 70, color: '#60A5FA' },
          { label: 'Streak', value: 12, unit: ' days', target: null, color: 'var(--color-accent-gold)' },
        ].map((stat) => (
          <Card key={stat.label} hoverEffect className="p-5">
            <span className="label-caps mb-2 block">{stat.label}</span>
            <div className="text-2xl font-display font-light text-[var(--color-text-page-title)]">
              <AnimatedCounter value={stat.value} suffix={stat.unit} />
            </div>
            {stat.target && (
              <div className="mt-3 h-1 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((stat.value / stat.target) * 100, 100)}%`, background: stat.color }}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Today's meals + insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-light text-[var(--color-text-page-title)]">Today's meals</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/app/meals')}>
              View all <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {mockMeals.map((meal) => (
              <Card key={meal.id} hoverEffect className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(46,204,154,0.1)] flex items-center justify-center">
                    <Flame className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[var(--color-text-page-title)]">{meal.name}</p>
                    <p className="text-[13px] text-[var(--color-text-meta)]">{meal.type} · {meal.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-medium text-[var(--color-text-page-title)]">{meal.calories} kcal</p>
                  <p className="text-[12px] text-[var(--color-text-meta)]">{meal.protein}g protein</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card glow className="p-6">
          <Badge variant="gold" className="mb-4">AI Insight</Badge>
          <h3 className="text-lg font-display font-light text-[var(--color-text-page-title)] mb-3">
            Protein boost needed
          </h3>
          <p className="text-[14px] text-[var(--color-text-body)] leading-relaxed mb-6">
            You're at 64% of your protein goal. Consider adding a lean protein source to dinner — grilled chicken or tofu would be ideal.
          </p>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/app/assistant')}>
            Ask AI Coach
          </Button>
        </Card>
      </div>
    </div>
  );
}
