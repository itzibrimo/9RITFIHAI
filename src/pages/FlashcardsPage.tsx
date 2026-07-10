import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Layers } from 'lucide-react';

export function FlashcardsPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    setDecks([
      { id: '1', title: 'Biology 101', createdAt: new Date() },
      { id: '2', title: 'Spanish Vocab', createdAt: new Date(Date.now() - 86400000) }
    ]);
  }, [user]);

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim() || !user || isCreating) return;
    
    setIsCreating(true);
    setTimeout(() => {
      setDecks(prev => [{ id: Date.now().toString(), title: newDeckTitle.trim(), createdAt: new Date() }, ...prev]);
      setNewDeckTitle('');
      setIsCreating(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Flashcards</h1>
          <p className="text-[var(--color-text-body)]">Master concepts with spaced repetition.</p>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Create New Deck</h3>
        <form onSubmit={handleCreateDeck} className="flex gap-4">
          <input 
            type="text"
            value={newDeckTitle}
            onChange={e => setNewDeckTitle(e.target.value)}
            placeholder="Deck Title (e.g. Biology 101)"
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3 text-white placeholder-[var(--color-text-meta)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <Button type="submit" disabled={isCreating || !newDeckTitle.trim()} className="shrink-0 gap-2">
            <Plus className="w-5 h-5" />
            Create
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[var(--color-text-meta)] border border-[var(--color-border-subtle)] rounded-2xl bg-[rgba(255,255,255,0.02)]">
            You don't have any decks yet. Create one above!
          </div>
        ) : (
          decks.map(deck => (
            <Card key={deck.id} hoverEffect className="p-6 flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-[rgba(139,92,246,0.1)] text-[var(--color-accent)]">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{deck.title}</h3>
              <p className="text-[13px] text-[var(--color-text-meta)] mb-6">0 cards • Created {deck.createdAt instanceof Date ? deck.createdAt.toLocaleDateString() : 'Just now'}</p>
              
              <div className="mt-auto flex gap-3">
                <Button variant="secondary" className="flex-1">Add Cards</Button>
                <Button className="flex-1" disabled>Study</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
