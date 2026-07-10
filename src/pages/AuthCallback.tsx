import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Supabase sends errors in the URL hash sometimes
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get('error');
      const hashErrorDescription = hashParams.get('error_description');
      
      if (hashError) {
        setError(hashErrorDescription || hashError);
        return;
      }

      // Check if we have a PKCE code to exchange
      const code = searchParams.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      // Ensure we have a valid session before redirecting
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      if (session) {
        navigate('/app/dashboard', { replace: true });
      } else {
        // Sometimes the session takes a moment to populate or the link was clicked on a different browser
        // If there's no code and no error, but also no session, show a friendly message.
        setError('Verification link is invalid or expired, or you may have opened it in a different browser. Try logging in or requesting a new link.');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-base)] text-white p-6">
        <div className="max-w-md w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--color-danger)]/20 text-[var(--color-danger)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Authentication Failed</h1>
          <p className="text-[var(--color-text-meta)] mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] text-white">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[var(--color-text-meta)]">Verifying your email...</p>
      </div>
    </div>
  );
}
