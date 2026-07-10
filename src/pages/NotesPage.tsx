import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { NoteEditorModal } from '../components/notes/NoteEditorModal';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Edit2, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    setNotes([
      { id: '1', title: 'Cellular Biology - Intro', content: 'Cellular biology is the study of cells...', updatedAt: new Date() },
      { id: '2', title: 'World War II Timeline', content: '1939 - Invasion of Poland...', updatedAt: new Date(Date.now() - 86400000) }
    ]);
  }, [user]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user || !confirm('Are you sure you want to delete this note?')) return;
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">My Notes</h1>
          <p className="text-[var(--color-text-body)]">Capture and organize your study materials.</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus strokeWidth={1.5} className="w-5 h-5" />
          New Note
        </Button>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-meta)]" />
        <input 
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl pl-12 pr-4 py-3 text-white placeholder-[var(--color-text-meta)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-meta)] border border-[var(--color-border-subtle)] rounded-2xl bg-[rgba(255,255,255,0.02)]">
          {search ? 'No notes match your search.' : "You don't have any notes yet. Create one to get started!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <Card key={note.id} className="p-5 flex flex-col h-48 group cursor-pointer" hoverEffect>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-[17px] text-white line-clamp-1">{note.title}</h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[var(--color-text-meta)] hover:text-white" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => handleDelete(e, note.id)} className="text-[var(--color-text-meta)] hover:text-[var(--color-danger)]" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[14px] text-[var(--color-text-meta)] line-clamp-3 mb-auto">
                {note.content}
              </p>
              <div className="text-[12px] text-[var(--color-text-meta)] pt-4 border-t border-[var(--color-border-subtle)] mt-4">
                {note.updatedAt instanceof Date ? note.updatedAt.toLocaleDateString() : 'Just now'}
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && <NoteEditorModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
