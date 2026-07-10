import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Logo } from '../components/ui/Logo';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export function AuthPage({ mode: initialMode }: AuthPageProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setSuccess('Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/app/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex noise-overlay">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(46,204,154,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(201,169,98,0.06),transparent_50%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Logo size="lg" />
          <div className="space-y-6 max-w-md">
            <h1 className="display-heading text-5xl text-[var(--color-text-page-title)]">
              Nourish with<br /><span className="gradient-text">intelligence</span>
            </h1>
            <p className="text-[var(--color-text-body)] leading-relaxed text-lg">
              Your personal AI nutritionist — scan meals, track macros, and achieve your goals with precision.
            </p>
          </div>
          <p className="text-[13px] text-[var(--color-text-meta)]">
            Trusted by 50,000+ health-conscious individuals worldwide.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[var(--color-text-meta)] hover:text-[var(--color-text-page-title)] transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-light text-[var(--color-text-page-title)] mb-2">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-[var(--color-text-body)]">
              {mode === 'signup'
                ? 'Start your premium nutrition journey today.'
                : 'Sign in to continue your progress.'}
            </p>
          </div>

          <div className="space-y-3 mb-6">
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
              Continue with Google
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
            <span className="text-[11px] text-[var(--color-text-meta)] uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <Input
              type="email"
              label="Email address"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-[var(--color-danger)] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.15)] rounded-xl p-3"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-[var(--color-success)] bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.15)] rounded-xl p-3"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[var(--color-text-meta)]">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <Link to="/auth/login" className="text-[var(--color-accent)] hover:text-[var(--color-text-page-title)] transition-colors">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-[var(--color-accent)] hover:text-[var(--color-accent-gold)] transition-colors">
                  Create one
                </Link>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
