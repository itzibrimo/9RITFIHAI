import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sun, Moon, Coffee, Cookie, Trash2, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Meal {
  id: string;
  name: string;
  type: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

const mealTypeConfig: Record<MealType, { icon: typeof Sun; label: string; color: string }> = {
  breakfast: { icon: Coffee, label: 'Breakfast', color: 'var(--color-accent-gold)' },
  lunch: { icon: Sun, label: 'Lunch', color: 'var(--color-accent)' },
  dinner: { icon: Moon, label: 'Dinner', color: '#60A5FA' },
  snack: { icon: Cookie, label: 'Snack', color: '#A78BFA' },
};

const initialMeals: Meal[] = [
  { id: '1', name: 'Greek Yogurt Bowl', type: 'breakfast', calories: 320, protein: 24, carbs: 38, fat: 8, time: '8:30 AM' },
  { id: '2', name: 'Grilled Salmon Salad', type: 'lunch', calories: 485, protein: 38, carbs: 22, fat: 28, time: '12:45 PM' },
  { id: '3', name: 'Almond & Berry Mix', type: 'snack', calories: 180, protein: 6, carbs: 14, fat: 12, time: '3:15 PM' },
];

export function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'lunch' as MealType, calories: '', protein: '', carbs: '', fat: '' });

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;
    const now = new Date();
    setMeals((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: form.name,
        type: form.type,
        calories: Number(form.calories),
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
        time: now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
      },
    ]);
    setForm({ name: '', type: 'lunch', calories: '', protein: '', carbs: '', fat: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const grouped = (['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => ({
    type,
    meals: meals.filter((m) => m.type === type),
    ...mealTypeConfig[type],
  }));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        badge="Meal Tracking"
        title="Your daily log"
        subtitle="Track every meal with precision. Your macros update in real time."
        action={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            Add meal
          </Button>
        }
      />

      {/* Daily totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Calories', value: totals.calories, unit: ' kcal' },
          { label: 'Protein', value: totals.protein, unit: 'g' },
          { label: 'Carbs', value: totals.carbs, unit: 'g' },
          { label: 'Fat', value: totals.fat, unit: 'g' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 text-center">
            <span className="label-caps mb-2 block">{stat.label}</span>
            <div className="text-3xl font-display font-light text-[var(--color-text-page-title)]">
              <AnimatedCounter value={stat.value} suffix={stat.unit} />
            </div>
          </Card>
        ))}
      </div>

      {/* Meals by type */}
      <div className="space-y-8">
        {grouped.map(({ type, meals: typeMeals, icon: Icon, label, color }) => (
          <section key={type}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <h3 className="text-lg font-display font-light text-[var(--color-text-page-title)]">{label}</h3>
              <Badge variant="default">{typeMeals.length}</Badge>
            </div>

            {typeMeals.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-[var(--color-text-meta)] text-sm">
                No {label.toLowerCase()} logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {typeMeals.map((meal) => (
                  <Card key={meal.id} hoverEffect className="p-4 flex items-center justify-between group">
                    <div>
                      <p className="text-[15px] font-medium text-[var(--color-text-page-title)]">{meal.name}</p>
                      <p className="text-[13px] text-[var(--color-text-meta)] mt-0.5">
                        {meal.time} · P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[15px] font-medium text-[var(--color-text-page-title)]">{meal.calories} kcal</span>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="text-[var(--color-text-meta)] hover:text-[var(--color-danger)] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Add meal modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-strong rounded-[24px] p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-[var(--color-text-meta)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-display font-light text-[var(--color-text-page-title)] mb-6">Log a meal</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <Input label="Food name" required placeholder="e.g. Grilled Chicken" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-meta)] mb-2">Meal type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, type: t })}
                        className={`py-2 rounded-xl text-[12px] font-medium capitalize transition-all ${
                          form.type === t
                            ? 'bg-[rgba(46,204,154,0.15)] text-[var(--color-accent)] border border-[rgba(46,204,154,0.3)]'
                            : 'glass text-[var(--color-text-meta)] hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Calories" type="number" required placeholder="320" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} />
                  <Input label="Protein (g)" type="number" placeholder="24" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
                  <Input label="Carbs (g)" type="number" placeholder="38" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} />
                  <Input label="Fat (g)" type="number" placeholder="8" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} />
                </div>
                <Button type="submit" className="w-full justify-center mt-2">Add to log</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
