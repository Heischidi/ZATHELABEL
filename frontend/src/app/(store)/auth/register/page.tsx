"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { RegisterRequest } from "@/types";

const schema = z.object({
  full_name: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password min 6 characters"),
  phone: z.string().optional(),
});

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    setError("");
    try {
      await authRegister(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold tracking-[0.2em] block mb-6">ZA</Link>
          <h1 className="font-display text-2xl font-bold">Create Account</h1>
          <p className="text-text-secondary text-sm mt-2">Join the ZA community</p>
        </div>

        <div className="card-dark p-8">
          {error && (
            <div className="bg-error/10 border border-error/30 text-error text-sm px-4 py-3 mb-5">{error}</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Full Name</label>
              <input {...register("full_name")} className="input-dark" placeholder="John Doe" />
              {errors.full_name && <p className="text-error text-xs mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Email</label>
              <input {...register("email")} type="email" className="input-dark" placeholder="your@email.com" />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Phone (optional)</label>
              <input {...register("phone")} type="tel" className="input-dark" placeholder="+234 800 000 0000" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Password</label>
              <input {...register("password")} type="password" className="input-dark" placeholder="••••••••" />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-4">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gold hover:text-accent-light transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
