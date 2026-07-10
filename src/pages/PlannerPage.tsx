import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarIcon, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { cn } from '../components/ui/Button';

export function PlannerPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Study');
  const [date, setDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    setTasks([
      { id: '1', title: 'Biology Midterm', type: 'Exam', date: '2024-11-20', completed: false },
      { id: '2', title: 'History Essay', type: 'Assignment', date: '2024-11-15', completed: true }
    ]);
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !user || isAdding) return;
    
    setIsAdding(true);
    setTimeout(() => {
      setTasks(prev => [{ id: Date.now().toString(), title: title.trim(), type, date, completed: false }, ...prev]);
      setTitle('');
      setDate('');
      setIsAdding(false);
    }, 500);
  };

  const toggleComplete = (task: any) => {
    if (!user) return;
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Planner</h1>
          <p className="text-[var(--color-text-body)]">Manage your study schedule, exams, and assignments.</p>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Event</h3>
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="flex-[2] bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-text-meta)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <select 
            value={type}
            onChange={e => setType(e.target.value)}
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] appearance-none"
          >
            <option value="Study">Study</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam">Exam</option>
          </select>
          <input 
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <Button type="submit" disabled={isAdding || !title.trim() || !date} className="shrink-0 gap-2">
            <Plus className="w-5 h-5" />
            Add
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Upcoming</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-meta)] border border-[var(--color-border-subtle)] rounded-2xl bg-[rgba(255,255,255,0.02)]">
            Your schedule is clear! Enjoy your free time.
          </div>
        ) : (
          tasks.map(task => (
            <Card key={task.id} className={cn("p-4 flex items-center justify-between transition-colors group", task.completed && "opacity-50")}>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleComplete(task)} className="text-[var(--color-text-meta)] hover:text-[var(--color-accent)] transition-colors">
                  {task.completed ? <CheckCircle2 className="w-6 h-6 text-[var(--color-success)]" /> : <Circle className="w-6 h-6" />}
                </button>
                <div>
                  <h4 className={cn("font-medium text-[16px] text-white", task.completed && "line-through")}>{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[13px]">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      task.type === 'Exam' ? "bg-[rgba(239,68,68,0.1)] text-red-400" :
                      task.type === 'Assignment' ? "bg-[rgba(139,92,246,0.1)] text-[var(--color-accent)]" :
                      "bg-[rgba(59,130,246,0.1)] text-blue-400"
                    )}>
                      {task.type}
                    </span>
                    <span className="text-[var(--color-text-meta)] flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {task.date}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(task.id)} className="p-2 text-[var(--color-text-meta)] hover:text-[var(--color-danger)] opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-5 h-5" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
