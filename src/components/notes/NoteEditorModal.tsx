import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';

export function NoteEditorModal({ onClose, onSave }: { onClose: () => void, onSave?: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    if (!user) return;

    setSaving(true);
    setTimeout(() => {
      if (onSave) onSave();
      setSaving(false);
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[var(--color-bg-elevated)] backdrop-blur-[24px] saturate-[180%] border border-[var(--color-border-subtle)] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col max-h-[85vh]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">New Note</h2>
            <button onClick={onClose} className="text-[var(--color-text-meta)] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="text-sm text-[var(--color-danger)] mb-4">{error}</div>
          )}

          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            <input 
              type="text" 
              placeholder="Note Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none text-2xl font-bold text-white focus:outline-none focus:ring-0 placeholder:text-[var(--color-text-meta)]"
            />
            <textarea 
              placeholder="Start writing..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-transparent border-none text-[15px] text-[var(--color-text-body)] focus:outline-none focus:ring-0 resize-none placeholder:text-[var(--color-text-meta)]"
            />
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-[var(--color-border-subtle)]">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save strokeWidth={1.5} className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
