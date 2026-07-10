import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { Target, Activity, Ruler, Scale } from 'lucide-react';

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [goals, setGoals] = useState({
    calorieTarget: 2200,
    proteinTarget: 150,
    carbsTarget: 250,
    fatTarget: 70,
    weight: 75,
    height: 178,
    activityLevel: 'moderate',
    dietType: 'balanced',
  });

  useEffect(() => {
    if (user) setDisplayName(user.displayName || '');
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setTimeout(() => {
      setUser({ ...user, displayName });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <PageHeader
        badge="Profile"
        title="Your profile"
        subtitle="Manage your personal information and nutrition goals."
      />

      {/* Avatar + name */}
      <Card className="p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-24 h-24 rounded-2xl ring-2 ring-[var(--color-border-subtle)]" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-gold)]/20 flex items-center justify-center text-3xl font-display text-[var(--color-text-page-title)] ring-2 ring-[var(--color-border-subtle)]">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-display font-light text-[var(--color-text-page-title)]">
              {displayName || 'Member'}
            </h3>
            <p className="text-[var(--color-text-meta)]">{user?.email}</p>
            <Badge variant="accent" className="mt-2">Free Plan</Badge>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />
          <Input label="Email" value={user?.email || ''} disabled />
          <div className="flex justify-end gap-3 pt-2">
            {saved && <span className="text-sm text-[var(--color-success)] self-center">Saved!</span>}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Body metrics */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="w-5 h-5 text-[var(--color-accent)]" />
          <h3 className="text-lg font-display font-light text-[var(--color-text-page-title)]">Body metrics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Scale, label: 'Weight', value: goals.weight, unit: ' kg' },
            { icon: Ruler, label: 'Height', value: goals.height, unit: ' cm' },
            { icon: Activity, label: 'Activity', value: goals.activityLevel, unit: '', text: true },
            { icon: Target, label: 'Diet', value: goals.dietType, unit: '', text: true },
          ].map((item) => (
            <div key={item.label} className="glass rounded-xl p-4 text-center">
              <item.icon className="w-4 h-4 text-[var(--color-text-meta)] mx-auto mb-2" />
              <span className="label-caps mb-1 block">{item.label}</span>
              {item.text ? (
                <span className="text-lg font-display font-light text-[var(--color-text-page-title)] capitalize">
                  {item.value as string}
                </span>
              ) : (
                <div className="text-2xl font-display font-light text-[var(--color-text-page-title)]">
                  <AnimatedCounter value={item.value as number} suffix={item.unit} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Nutrition goals */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-[var(--color-accent-gold)]" />
          <h3 className="text-lg font-display font-light text-[var(--color-text-page-title)]">Daily targets</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Calories', value: goals.calorieTarget, unit: ' kcal', color: 'var(--color-accent)' },
            { label: 'Protein', value: goals.proteinTarget, unit: 'g', color: 'var(--color-accent)' },
            { label: 'Carbs', value: goals.carbsTarget, unit: 'g', color: 'var(--color-accent-gold)' },
            { label: 'Fat', value: goals.fatTarget, unit: 'g', color: '#60A5FA' },
          ].map((g) => (
            <div key={g.label} className="glass rounded-xl p-5">
              <span className="label-caps mb-2 block">{g.label}</span>
              <div className="text-2xl font-display font-light text-[var(--color-text-page-title)]">
                <AnimatedCounter value={g.value} suffix={g.unit} />
              </div>
              <div className="mt-3 h-1 bg-[rgba(255,255,255,0.05)] rounded-full">
                <div className="h-full w-3/4 rounded-full" style={{ background: g.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
