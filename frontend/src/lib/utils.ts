import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PaymentStatus, OrderStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "₦"): string {
  return `${currency}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProductPrimaryImage(images: { image_url: string; is_primary: boolean }[]): string {
  const primary = images.find((i) => i.is_primary);
  return primary?.image_url || images[0]?.image_url || "/placeholder-product.jpg";
}

export function getPaymentStatusClass(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    awaiting_payment: "status-awaiting",
    payment_confirmed: "status-confirmed",
    payment_failed: "status-failed",
  };
  return map[status] || "";
}

export function getOrderStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: "status-awaiting",
    confirmed: "status-confirmed",
    processing: "status-processing",
    shipped: "status-shipped",
    delivered: "status-delivered",
    cancelled: "status-cancelled",
  };
  return map[status] || "";
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    awaiting_payment: "Awaiting Payment",
    payment_confirmed: "Payment Confirmed",
    payment_failed: "Payment Failed",
  };
  return map[status] || status;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status] || status;
}

export function generateSessionId(): string {
  return `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("za_session_id");
  if (!id) {
    id = generateSessionId();
    sessionStorage.setItem("za_session_id", id);
  }
  return id;
}
