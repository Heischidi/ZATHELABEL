"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { saveTokens, clearTokens, saveUser, getStoredUser } from "@/lib/auth";
import { User, LoginRequest, RegisterRequest, TokenResponse } from "@/types";
import toast from "react-hot-toast";

interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAdmin: false,
});

export function useAuth() {
  return useContext(AuthCtx);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await api.post<TokenResponse>("/api/auth/login", data);
    saveTokens(res.data);
    const me = await api.get<User>("/api/auth/me");
    saveUser(me.data);
    setUser(me.data);
    toast.success(`Welcome back, ${me.data.full_name.split(" ")[0]}!`);
    router.push(me.data.is_admin ? "/admin" : "/dashboard");
  }, [router]);

  const register = useCallback(async (data: RegisterRequest) => {
    await api.post("/api/auth/register", data);
    toast.success("Account created! Please log in.");
    router.push("/auth/login");
  }, [router]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    qc.clear();
    router.push("/");
    toast.success("Logged out successfully");
  }, [qc, router]);

  return (
    <AuthCtx.Provider
      value={{ user, isLoading, login, register, logout, isAdmin: user?.is_admin ?? false }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
