import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Heart, MessageCircle } from 'lucide-react';

export function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setPosts([
      { id: '1', authorName: 'Alice M.', content: 'Any tips for memorizing the Krebs cycle? It just won\'t stick!', likes: 5, createdAt: new Date() },
      { id: '2', authorName: 'StudyBot', content: 'Here\'s a great resource for learning React patterns...', likes: 12, createdAt: new Date(Date.now() - 86400000) }
    ]);
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user || isPosting) return;
    
    setIsPosting(true);
    setTimeout(() => {
      setPosts(prev => [{
        id: Date.now().toString(),
        userId: user.uid,
        authorName: user.displayName || 'Anonymous Student',
        content: content.trim(),
        likes: 0,
        createdAt: new Date()
      }, ...prev]);
      setContent('');
      setIsPosting(false);
    }, 500);
  };

  const handleLike = (postId: string, currentLikes: number) => {
    if (!user) return;
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: currentLikes + 1 } : p));
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Community</h1>
        <p className="text-[var(--color-text-body)]">Share study tips and connect with other students.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handlePost}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Share a study tip, ask a question, or post a resource..."
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-xl p-4 text-white placeholder-[var(--color-text-meta)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[100px] resize-none mb-4"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!content.trim() || isPosting || !user} className="gap-2">
              <Send className="w-4 h-4" />
              Post
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-white shadow-inner">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-white">{post.authorName}</h4>
                <p className="text-[12px] text-[var(--color-text-meta)]">
                  {post.createdAt instanceof Date ? post.createdAt.toLocaleString() : 'Just now'}
                </p>
              </div>
            </div>
            <p className="text-[15px] text-[var(--color-text-body)] whitespace-pre-wrap mb-6">
              {post.content}
            </p>
            <div className="flex items-center gap-6 pt-4 border-t border-[var(--color-border-subtle)]">
              <button 
                onClick={() => handleLike(post.id, post.likes)}
                className="flex items-center gap-2 text-[var(--color-text-meta)] hover:text-pink-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-[var(--color-text-meta)] hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Reply</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
