import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';

const suggestions = [
  'What should I eat for dinner to hit my protein goal?',
  'Analyze my macro balance this week',
  'Suggest a high-protein breakfast under 400 calories',
  'How can I reduce my sugar intake?',
];

export function AssistantPage() {
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    setMessages([
      {
        id: '1',
        role: 'model',
        content: "Hello! I'm your AI nutrition coach. I can help with meal planning, macro analysis, dietary questions, and personalized recommendations. What would you like to know?",
      },
    ]);
  }, [user]);

  const handleSend = async (text?: string) => {
    const userMessage = (text || input).trim();
    if (!userMessage || !user || loading) return;

    setInput('');
    setLoading(true);
    const newUserMsg = { id: Date.now().toString(), role: 'user', content: userMessage };
    setMessages((prev) => [...prev, newUserMsg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMsg].map((msg) => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.content,
          })),
          systemPrompt: 'You are a premium AI nutrition coach for 9RITFIH AI. Provide concise, actionable nutrition advice. Focus on macros, meal planning, and healthy eating. Be warm but professional.',
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'model', content: data.content || 'No response.' },
      ]);
    } catch (error: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          content: `I apologize, but I encountered an issue. ${error instanceof Error ? error.message : 'Please try again.'}`,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)]">
      <PageHeader
        badge="AI Coach"
        title="Your nutrition advisor"
        subtitle="Personalized guidance powered by advanced AI. Ask anything about your diet."
      />

      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
          {messages.length <= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="glass rounded-xl p-4 text-left text-[14px] text-[var(--color-text-body)] hover:border-[var(--color-border-glow)] hover:text-[var(--color-text-page-title)] transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 text-[var(--color-accent)] mb-2" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)]'
                    : 'glass'
                }`}
              >
                {msg.role === 'user' ? (
                  <span className="text-[12px] font-bold text-[#060608]">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <Bot className="w-4 h-4 text-[var(--color-accent)]" />
                )}
              </div>
              <div
                className={`px-5 py-3.5 rounded-2xl max-w-[80%] text-[15px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[rgba(46,204,154,0.12)] text-[var(--color-text-page-title)] border border-[rgba(46,204,154,0.2)] rounded-tr-md'
                    : 'glass text-[var(--color-text-body)] rounded-tl-md'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
                <Bot className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
              </div>
              <div className="glass px-5 py-3.5 rounded-2xl rounded-tl-md flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-[var(--color-border-subtle)] glass">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about nutrition, macros, meal plans..."
              disabled={loading}
              className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-full pl-5 pr-4 py-3.5 text-[var(--color-text-page-title)] placeholder-[var(--color-text-meta)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] flex items-center justify-center text-[#060608] disabled:opacity-40 transition-all hover:shadow-[0_4px_20px_rgba(46,204,154,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex justify-center mt-2">
            <Badge variant="default">15 / 50 messages this month</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
