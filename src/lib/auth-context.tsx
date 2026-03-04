"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import AuthModal from "@/components/AuthModal";

interface User {
  id: number;
  name: string;
  username: string | null;
  email: string;
  account_type: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  requireAuth: () => boolean; // returns true if already logged in, shows modal if not
  showAuthModal: () => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  requireAuth: () => false,
  showAuthModal: () => {},
  logout: () => {},
  refresh: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchUser = useCallback(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const requireAuth = useCallback(() => {
    if (user) return true;
    setShowModal(true);
    return false;
  }, [user]);

  const showAuthModal = useCallback(() => setShowModal(true), []);

  const logout = useCallback(() => {
    document.cookie = "token=; Path=/; Max-Age=0";
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, requireAuth, showAuthModal, logout, refresh: fetchUser }}>
      {children}
      {showModal && <AuthModal onClose={() => { setShowModal(false); fetchUser(); }} />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
