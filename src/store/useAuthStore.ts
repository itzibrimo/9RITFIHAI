import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        set({
          user: {
            uid: session.user.id,
            email: session.user.email ?? null,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            photoURL: session.user.user_metadata?.avatar_url || null,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: {
            uid: session.user.id,
            email: session.user.email ?? null,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            photoURL: session.user.user_metadata?.avatar_url || null,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  }
}));
