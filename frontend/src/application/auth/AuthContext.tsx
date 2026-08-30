import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentSession, loginWithPassword, logout, type AuthSession } from "../../infrastructure/api/authApi";

type AuthState = {
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("fc_access_token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    let mounted = true;

    getCurrentSession(storedToken)
      .then((response) => {
        if (mounted && response.authenticated) {
          const persisted = window.localStorage.getItem("fc_auth_session");
          if (persisted) {
            setSession(JSON.parse(persisted) as AuthSession);
          }
        }
      })
      .catch(() => {
        window.localStorage.removeItem("fc_access_token");
        window.localStorage.removeItem("fc_auth_session");
        setSession(null);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      loading,
      async signIn(email: string, password: string) {
        const response = await loginWithPassword(email, password);
        setSession(response.session);
        window.localStorage.setItem("fc_access_token", response.session.access_token);
        window.localStorage.setItem("fc_auth_session", JSON.stringify(response.session));
      },
      async signOut() {
        await logout();
        window.localStorage.removeItem("fc_access_token");
        window.localStorage.removeItem("fc_auth_session");
        setSession(null);
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
