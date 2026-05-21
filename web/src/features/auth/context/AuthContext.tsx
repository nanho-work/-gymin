"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  getCurrentSession,
  loginWithFirebaseToken,
  logout as logoutSession,
  type AuthRole,
  type AuthSessionResponse,
  type AuthUser
} from "@/shared/api/authClient";
import { getFirebaseAuth, googleProvider } from "@/shared/lib/firebase";

type AuthStatus = "loading" | "authenticated" | "guest";

type AuthContextValue = {
  loginWithGoogle: (role: AuthRole) => Promise<AuthSessionResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthSessionResponse | null>;
  session: AuthSessionResponse | null;
  status: AuthStatus;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSessionResponse | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshSession = useCallback(async () => {
    try {
      const nextSession = await getCurrentSession();
      setSession(nextSession);
      setStatus("authenticated");
      return nextSession;
    } catch {
      setSession(null);
      setStatus("guest");
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const loginWithGoogle = useCallback(async (role: AuthRole) => {
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken(true);
    const nextSession = await loginWithFirebaseToken({ idToken, role });
    setSession(nextSession);
    setStatus("authenticated");
    return nextSession;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      try {
        await signOut(getFirebaseAuth());
      } catch {
        // Firebase 설정이 없는 로컬 환경에서도 서버 세션 정리는 유지한다.
      }

      setSession(null);
      setStatus("guest");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      loginWithGoogle,
      logout,
      refreshSession,
      session,
      status,
      user: session?.user ?? null
    }),
    [loginWithGoogle, logout, refreshSession, session, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다.");
  }
  return value;
}
