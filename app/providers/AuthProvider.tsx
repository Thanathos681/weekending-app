import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { saveSession, getSession, clearSession } from '../lib/storage';

type User = import('@supabase/supabase-js').User;
type Session = import('@supabase/supabase-js').Session;

type Ctx = {
  user: User | null; session: Session | null; loading: boolean;
  signIn(email: string, password: string): Promise<{ error?: string }>;
  signUp(email: string, password: string): Promise<{ error?: string }>;
  signOut(): Promise<void>;
};
const AuthCtx = createContext<Ctx>(null as any);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await getSession<Session>();
      if (stored) { setSession(stored); setUser(stored.user ?? null); }
      const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
        setSession(sess ?? null); setUser(sess?.user ?? null);
        if (sess) await saveSession(sess); else await clearSession();
      });
      setLoading(false);
      return () => sub.subscription.unsubscribe();
    })();
  }, []);

  const value: Ctx = useMemo(() => ({
    user, session, loading,
    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.session) await saveSession(data.session);
      return {};
    },
    async signUp(email, password) {
      const { error } = await supabase.auth.signUp({ email, password });
      return error ? { error: error.message } : {};
    },
    async signOut() { await supabase.auth.signOut(); await clearSession(); }
  }), [user, session, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};
