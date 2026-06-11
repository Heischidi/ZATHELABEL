"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { LoginRequest } from "@/types";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    setError("");
    try {
      await login(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold tracking-[0.2em] text-white block mb-6">ZA</Link>
          <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
          <p className="text-text-secondary text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="card-dark p-8">
          {error && (
            <div className="bg-error/10 border border-error/30 text-error text-sm px-4 py-3 mb-5">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Email</label>
              <input {...register("email")} type="email" className="input-dark" placeholder="your@email.com" />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="input-dark pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs text-text-secondary hover:text-gold transition-colors">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-4">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-gold hover:text-accent-light transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
