"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Category, Product } from "@/types";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, X, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  description: z.string().optional(),
  price: z.number().min(0),
  discount_price: z.number().optional(),
  category_id: z.number().optional(),
  stock_quantity: z.number().min(0).default(0),
  is_featured: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");
  const [uploadedImages, setUploadedImages] = useState<{ id?: number; image_url: string; public_id?: string; is_primary?: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["admin-product", id],
    queryFn: () => api.get(`/api/admin/products/${id}`).then((r) => r.data),
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories").then((r) => r.data),
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: product.price,
        discount_price: product.discount_price,
        category_id: product.category_id || undefined,
        stock_quantity: product.stock_quantity,
        is_featured: product.is_featured,
        is_new_arrival: product.is_new_arrival,
        is_best_seller: product.is_best_seller,
        is_active: product.is_active,
      });
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setUploadedImages(product.images || []);
    }
  }, [product, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // 1. Update basic details
      await api.put(`/api/admin/products/${id}`, {
        ...data,
        sizes,
        colors,
      });

      // 2. Identify new images to add
      const existingIds = product?.images.map((img) => img.id) || [];
      const newImages = uploadedImages.filter((img) => !img.id);

      for (let i = 0; i < newImages.length; i++) {
        await api.post(`/api/admin/products/${id}/images`, null, {
          params: {
            image_url: newImages[i].image_url,
            public_id: newImages[i].public_id,
            is_primary: i === 0 && uploadedImages.findIndex(x => x.is_primary) === -1,
            sort_order: i + existingIds.length,
          },
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-product", id] });
      toast.success("Product updated!");
      router.push("/admin/products");
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) =>
      api.delete(`/api/admin/products/${id}/images/${imageId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-product", id] });
      toast.success("Image deleted");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await api.post("/api/upload/image", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedImages((prev) => [...prev, { image_url: res.data.url, public_id: res.data.public_id }]);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
  };

  const handleRemoveImage = (img: any, index: number) => {
    if (img.id) {
      if (confirm("Permanently delete this image?")) {
        deleteImageMutation.mutate(img.id);
        setUploadedImages(uploadedImages.filter((_, j) => j !== index));
      }
    } else {
      setUploadedImages(uploadedImages.filter((_, j) => j !== index));
    }
  };

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (productLoading) {
    return <div className="skeleton h-96" />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-text-secondary hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-3xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
        {/* Basic Info */}
        <div className="card-dark p-6 space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Product Name *</label>
              <input
                {...register("name")}
                className="input-dark"
                onChange={(e) => {
                  register("name").onChange(e);
                  setValue("slug", slugify(e.target.value));
                }}
              />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Slug *</label>
              <input {...register("slug")} className="input-dark" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2">Description</label>
            <textarea {...register("description")} rows={3} className="input-dark resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2">Category</label>
            <select {...register("category_id", { valueAsNumber: true })} className="input-dark">
              <option value="">No category</option>
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="card-dark p-6 space-y-4">
          <h2 className="font-semibold">Pricing & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Price (₦) *</label>
              <input {...register("price", { valueAsNumber: true })} type="number" step="0.01" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Discount Price</label>
              <input {...register("discount_price", { valueAsNumber: true })} type="number" step="0.01" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">Stock</label>
              <input {...register("stock_quantity", { valueAsNumber: true })} type="number" className="input-dark" />
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="card-dark p-6">
          <h2 className="font-semibold mb-4">Sizes</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="e.g. XS, S, M, L..."
              className="input-dark flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (sizeInput && !sizes.includes(sizeInput)) {
                    setSizes([...sizes, sizeInput.toUpperCase()]);
                    setSizeInput("");
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => { if (sizeInput) { setSizes([...sizes, sizeInput.toUpperCase()]); setSizeInput(""); } }}
              className="btn-outline px-4 py-2 text-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <span key={s} className="flex items-center gap-1 px-3 py-1 bg-surface border border-border text-sm">
                {s}
                <button type="button" onClick={() => setSizes(sizes.filter((x) => x !== s))}>
                  <X className="w-3 h-3 text-text-secondary hover:text-white" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="card-dark p-6">
          <h2 className="font-semibold mb-4">Colors</h2>
          <div className="flex gap-2 mb-3">
            <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} placeholder="Color name" className="input-dark flex-1" />
            <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="w-12 h-[46px] bg-surface border border-border cursor-pointer" />
            <button
              type="button"
              onClick={() => { if (colorName) { setColors([...colors, { name: colorName, hex: colorHex }]); setColorName(""); } }}
              className="btn-outline px-4 py-2 text-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c, i) => (
              <span key={i} className="flex items-center gap-2 px-3 py-1 bg-surface border border-border text-sm">
                <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                {c.name}
                <button type="button" onClick={() => setColors(colors.filter((_, j) => j !== i))}>
                  <X className="w-3 h-3 text-text-secondary hover:text-white" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="card-dark p-6">
          <h2 className="font-semibold mb-4">Product Images</h2>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-border hover:border-gold transition-colors p-8 text-center">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-gold mx-auto animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Click to upload images (JPEG, PNG, WebP)</p>
                  <p className="text-xs text-text-secondary mt-1">First image will be the primary image</p>
                </>
              )}
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          </label>
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {uploadedImages.map((img, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img, i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {img.is_primary && <div className="absolute bottom-1 left-1 text-[9px] bg-gold text-black px-1">PRIMARY</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flags */}
        <div className="card-dark p-6">
          <h2 className="font-semibold mb-4">Product Flags</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "is_featured", label: "Featured" },
              { key: "is_new_arrival", label: "New Arrival" },
              { key: "is_best_seller", label: "Best Seller" },
              { key: "is_active", label: "Active (visible)" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input {...register(key as any)} type="checkbox" className="w-4 h-4 accent-gold" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={updateMutation.isPending} className="btn-gold px-8">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline px-8">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
