"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "../../lib/api";

export type User = {
  id?: string;
  name: string;
  email: string;
  phone: string;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    data: User & { password: string; confirmPassword: string },
  ) => Promise<AuthResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "nilams-auth-v2";

type Session = { user: User; token: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Session;
        setUser(saved.user);
        setToken(saved.token);
      }
    } catch {
      // ignore malformed session
    }
    setHydrated(true);
  }, []);

  const persist = (next: Session | null) => {
    setUser(next?.user ?? null);
    setToken(next?.token ?? null);
    try {
      if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const res = await apiFetch<{ user: User; token: string }>(
        "/api/auth/login",
        { method: "POST", body: { email, password } },
      );
      persist({ user: res.user, token: res.token });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Could not sign in.",
      };
    }
  };

  const register: AuthContextValue["register"] = async (data) => {
    if (!data.password || data.password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    if (data.password !== data.confirmPassword) {
      return { ok: false, error: "Passwords don't match." };
    }
    try {
      const res = await apiFetch<{ user: User; token: string }>(
        "/api/auth/register",
        {
          method: "POST",
          body: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
          },
        },
      );
      persist({ user: res.user, token: res.token });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Could not create account.",
      };
    }
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, token, hydrated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
