import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type ProfileType = 'faculdade' | 'concurso' | 'oab' | 'advogado';

interface UserProfile {
  id: string;
  nome_completo?: string;
  email: string;
  profile_type?: ProfileType;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, profileType: ProfileType) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile using raw queries to avoid type recursion
  const fetchProfile = async (userId: string) => {
    try {
      // Fallback to direct table queries with type assertion
      const profileResult = await (supabase as any)
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single();

      const settingsResult = await (supabase as any)
        .from('user_settings')
        .select('profile_type')
        .eq('id', userId)
        .single();

      const profileData = profileResult.data;
      const settingsData = settingsResult.data;

      if (profileData) {
        const profileType = settingsData?.profile_type;
        const validProfileType = (profileType === 'faculdade' || profileType === 'concurso' || 
                                 profileType === 'oab' || profileType === 'advogado') ? 
                                 profileType as ProfileType : undefined;

        setProfile({
          id: profileData.id,
          nome_completo: profileData.nome_completo,
          email: profileData.email,
          profile_type: validProfileType
        });
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      // Set basic profile from user metadata if available
      if (user?.user_metadata) {
        setProfile({
          id: userId,
          nome_completo: user.user_metadata.nome_completo,
          email: user.email || '',
          profile_type: user.user_metadata.profile_type as ProfileType
        });
      } else {
        // Se não conseguir buscar nem user_metadata, cria um perfil básico
        setProfile({
          id: userId,
          nome_completo: user?.email?.split('@')[0] || 'Usuário',
          email: user?.email || '',
          profile_type: undefined
        });
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid blocking auth state change
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id);
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  const signUp = async (email: string, password: string, fullName: string, profileType: ProfileType) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome_completo: fullName,
            profile_type: profileType
          }
        }
      });

      if (error) {
        console.error('Erro no signUp:', error);
      }

      return { error };
    } catch (error) {
      console.error('Erro inesperado no signUp:', error);
      return { 
        error: { 
          message: 'Erro inesperado durante o cadastro. Tente novamente.' 
        } as any 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,  
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};