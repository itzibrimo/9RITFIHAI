import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function AuthModal({ initialMode = 'signup', onClose }: { initialMode?: 'signin' | 'signup', onClose: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAppleAuth = () => {
    setError('Apple Auth requires developer account setup. Use Google or Email for now.');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
        navigate('/app/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          className="relative w-full max-w-md bg-[var(--color-bg-elevated)] backdrop-blur-[24px] saturate-[180%] border border-[var(--color-border-subtle)] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--color-text-meta)] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {mode === 'signup' ? 'Create your free account' : 'Welcome back'}
            </h2>
            <p className="text-[15px] text-[var(--color-text-body)]">
              {mode === 'signup' ? 'Stop studying harder. Start studying smarter.' : 'Enter your details to sign in.'}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <Button 
              variant="secondary" 
              className="w-full justify-center gap-3"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full justify-center gap-3"
              onClick={handleAppleAuth}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.53.68 3.14.68.65 0 2.03-.78 3.53-.66 1.55.05 2.87.65 3.55 1.6-3.13 1.76-2.58 5.67.4 6.75-.72 1.83-1.63 3.58-2.62 4.6zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              {mode === 'signup' ? 'Sign up with Apple' : 'Sign in with Apple'}
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
            <span className="text-[13px] text-[var(--color-text-meta)] uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <input 
                type="email" 
                required
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-white placeholder-[var(--color-text-meta)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <input 
                type="password" 
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-white placeholder-[var(--color-text-meta)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Please wait...' : (mode === 'signup' ? 'Sign up free' : 'Sign in')}
            </Button>
          </form>

          <div className="mt-6 text-center text-[13px] text-[var(--color-text-meta)]">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} className="text-[var(--color-accent)] hover:text-white transition-colors">
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-[var(--color-accent)] hover:text-white transition-colors">
                  Sign up
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
