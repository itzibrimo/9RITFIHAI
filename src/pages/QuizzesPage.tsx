import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckSquare, Play, Clock, Trophy } from 'lucide-react';

export function QuizzesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Quizzes</h1>
          <p className="text-[var(--color-text-body)]">Test your knowledge and track your progress.</p>
        </div>
        <Button className="gap-2 shrink-0">
          <CheckSquare className="w-5 h-5" />
          Generate Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 rounded bg-[rgba(255,255,255,0.05)] text-[var(--color-text-meta)]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-[var(--color-text-meta)] font-medium">Quizzes Taken</span>
          </div>
          <div className="text-3xl font-bold text-white">0</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 rounded bg-[rgba(255,255,255,0.05)] text-[var(--color-accent)]">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[var(--color-text-meta)] font-medium">Average Score</span>
          </div>
          <div className="text-3xl font-bold text-white">0%</div>
        </Card>
      </div>

      <h3 className="text-xl font-bold text-white mb-4">Recommended for You</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between" hoverEffect>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[rgba(139,92,246,0.1)] text-[var(--color-accent)] border border-[rgba(139,92,246,0.2)] mb-3">
              Auto-Generated
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">Cellular Biology Review</h4>
            <div className="flex items-center gap-4 text-[13px] text-[var(--color-text-meta)]">
              <span className="flex items-center gap-1"><CheckSquare className="w-4 h-4" /> 10 Questions</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15 Mins</span>
            </div>
          </div>
          <Button className="shrink-0 gap-2">
            <Play className="w-4 h-4 fill-current" />
            Start Quiz
          </Button>
        </Card>
      </div>
    </div>
  );
}
