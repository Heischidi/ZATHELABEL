"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardProfilePage() {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: { full_name: user?.full_name || "", phone: user?.phone || "" },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.put("/api/users/profile", data),
    onSuccess: () => toast.success("Profile updated!"),
    onError: () => toast.error("Update failed"),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">My Profile</h1>
      <div className="card-dark p-6 max-w-lg">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2">Full Name</label>
            <input {...register("full_name")} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2">Email</label>
            <input value={user?.email} readOnly className="input-dark opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2">Phone</label>
            <input {...register("phone")} type="tel" className="input-dark" />
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-gold">
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
