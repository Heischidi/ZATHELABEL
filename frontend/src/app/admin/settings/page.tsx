"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Setting {
  key: string;
  value: string | null;
}

const SETTINGS_SCHEMA = [
  { key: "brand_name", label: "Brand Name", type: "text" },
  { key: "whatsapp_number", label: "WhatsApp Number (no +)", type: "text", placeholder: "2348000000000" },
  { key: "delivery_fee", label: "Delivery Fee (₦)", type: "number" },
  { key: "contact_email", label: "Contact Email", type: "email" },
  { key: "contact_phone", label: "Contact Phone", type: "text" },
  { key: "contact_address", label: "Contact Address", type: "text" },
  { key: "homepage_bg_url", label: "Homepage Background Image URL (Instagram or Image Link)", type: "text", placeholder: "https://example.com/image.jpg" },
  { key: "meta_description", label: "Meta Description (SEO)", type: "textarea" },
  { key: "social_links", label: "Social Links (JSON)", type: "textarea", placeholder: '{"instagram":"","twitter":"","facebook":""}' },
];

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploadingBg, setUploadingBg] = useState(false);

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ["admin-settings"],
    queryFn: () => api.get("/api/admin/settings").then((r) => r.data),
  });

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => { map[s.key] = s.value || ""; });
      setValues(map);
    }
  }, [settings]);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await api.post("/api/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setValues((prev) => ({ ...prev, homepage_bg_url: res.data.url }));
      toast.success("Background image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingBg(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: () => api.put("/api/admin/settings", { settings: values }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Settings saved!");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Website Settings</h1>

      <div className="card-dark p-6 space-y-5">
        {SETTINGS_SCHEMA.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2">{label}</label>
            {key === "homepage_bg_url" ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={values[key] || ""}
                    onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="input-dark flex-1"
                  />
                  <label className="btn-outline px-4 py-3 text-xs cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px]">
                    {uploadingBg ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Upload Photo"
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBgUpload}
                      disabled={uploadingBg}
                    />
                  </label>
                </div>
                {values[key] && (
                  <div className="relative w-32 h-20 border border-border overflow-hidden bg-black/40 group">
                    <img src={values[key]} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValues({ ...values, [key]: "" })}
                      className="absolute top-1 right-1 bg-red-600/90 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ) : type === "textarea" ? (
              <textarea
                value={values[key] || ""}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                rows={3}
                placeholder={placeholder}
                className="input-dark resize-none font-mono text-xs"
              />
            ) : (
              <input
                type={type}
                value={values[key] || ""}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                placeholder={placeholder}
                className="input-dark"
              />
            )}
          </div>
        ))}

        <button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending || isLoading}
          className="btn-gold flex items-center gap-2"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </button>
      </div>
    </div>
  );
}
