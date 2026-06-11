"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Wishlist } from "@/types";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/auth";

export function useWishlist() {
  const qc = useQueryClient();
  const isAuth = !!getAccessToken();

  const { data: wishlist } = useQuery<Wishlist>({
    queryKey: ["wishlist"],
    queryFn: () => api.get("/api/wishlist").then((r) => r.data),
    enabled: isAuth,
  });

  const addMutation = useMutation({
    mutationFn: (productId: number) =>
      api.post("/api/wishlist", { product_id: productId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Added to wishlist");
    },
    onError: () => toast.error("Please log in to use wishlist"),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) =>
      api.delete(`/api/wishlist/${productId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist");
    },
  });

  const isInWishlist = (productId: number) =>
    wishlist?.items.some((i) => i.product_id === productId) ?? false;

  return {
    wishlist,
    isInWishlist,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
