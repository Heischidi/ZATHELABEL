"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset instructions sent!");
    } catch {
      toast.error("Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold tracking-[0.2em] block mb-6">ZA</Link>
          <h1 className="font-display text-2xl font-bold">Reset Password</h1>
          <p className="text-text-secondary text-sm mt-2">Enter your email to receive reset instructions</p>
        </div>
        <div className="card-dark p-8">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-green-400 font-medium">Instructions sent!</p>
              <p className="text-text-secondary text-sm mt-2">Check your email for the password reset link.</p>
              <Link href="/auth/login" className="btn-gold mt-6 inline-block">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-4">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Send Reset Link
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-text-secondary mt-6">
          <Link href="/auth/login" className="text-gold hover:text-accent-light transition-colors">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
