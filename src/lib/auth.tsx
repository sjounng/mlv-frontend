"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { api, refreshAccessToken, setAccessToken } from "@/lib/api";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN";
export type Role = "USER" | "OPERATOR" | "SUPER_ADMIN";

export interface Profile {
  id: number;
  minecraftUuid: string;
  minecraftUsername: string;
  email: string | null;
  status: UserStatus;
  agreedTermsAt: string | null;
  createdAt: string;
}

export type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthState {
  status: AuthStatus;
  profile: Profile | null;
  cashBalance: number | null;
  /** 캐시 잔액 등 사용자 종속 데이터를 다시 불러온다. */
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const skipUserBootstrap = pathname.startsWith("/admin");
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cashBalance, setCashBalance] = useState<number | null>(null);

  const loadMe = useCallback(async () => {
    const [me, cash] = await Promise.all([
      api.get<Profile>("/api/me/profile"),
      api.get<{ balance: number }>("/api/me/cash"),
    ]);
    setProfile(me);
    setCashBalance(cash.balance);
    setStatus("authenticated");
  }, []);

  const bootstrap = useCallback(async () => {
    if (skipUserBootstrap) {
      setProfile(null);
      setCashBalance(null);
      setStatus("anonymous");
      return;
    }

    const token = await refreshAccessToken();
    if (!token) {
      setStatus("anonymous");
      return;
    }
    try {
      await loadMe();
    } catch {
      setAccessToken(null);
      setProfile(null);
      setCashBalance(null);
      setStatus("anonymous");
    }
  }, [loadMe, skipUserBootstrap]);

  useEffect(() => {
    // bootstrap 의 setState 는 모두 await(네트워크) 이후 실행되므로 동기 cascading 이 아니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void bootstrap();
  }, [bootstrap]);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      await loadMe();
    } catch {
      // 세션 만료 등은 다음 요청의 401 처리에 맡긴다.
    }
  }, [status, loadMe]);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout", undefined, { skipAuthRetry: true });
    } catch {
      // 로그아웃은 실패해도 클라이언트 상태를 정리한다.
    }
    setAccessToken(null);
    setProfile(null);
    setCashBalance(null);
    setStatus("anonymous");
  }, []);

  return (
    <AuthContext.Provider
      value={{ status, profile, cashBalance, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
