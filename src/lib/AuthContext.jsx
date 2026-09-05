import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [profile, setProfile] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Busca inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    // Ouve mudanças (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.warn("⚠️ [Pedago System] Não foi possível carregar o perfil do utilizador:", error.message);
      console.warn("Isso acontece se a tabela 'profiles' não tiver um registo correspondente para o ID:", userId);
      console.warn("Execute o SQL de inserção no Dashboard para criar o perfil.");
    }
    setProfile(data);
  };

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    // Pequeno atraso para mostrar o ecrã de transição
    await new Promise(resolve => setTimeout(resolve, 1200));
    await supabase.auth.signOut();
    setLoggingOut(false);
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading: session === undefined, loggingOut, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

