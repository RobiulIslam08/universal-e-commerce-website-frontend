"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./image-upload";
import { categories } from "@/constants/products";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { IProduct } from "@/types/product";
import { updateProduct } from "@/services/product";

// Schema - same as AddProductForm but maybe some fields are optional or handled differently?
// For now, keeping it same.
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  strikePrice: z.number().min(0, "Strike price cannot be negative"),
  stockQuantity: z.number().int().min(0, "Stock quantity cannot be negative"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(
      /^[A-Z0-9-]+$/,
      "SKU must contain only uppercase letters, numbers, and hyphens"
    ),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  longDescription: z
    .string()
    .min(20, "Long description must be at least 20 characters"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface EditProductModalProps {
  product: IProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditProductModal({
  product,
  open,
  onOpenChange,
  onSuccess,
}: EditProductModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [specifications, setSpecifications] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: 0,
      strikePrice: 0,
      stockQuantity: 0,
    },
  });

  // Initialize form with product data
  useEffect(() => {
    if (product && open) {
      reset({
        title: product.title,
        category: product.category,
        subCategory: product.subCategory || "",
        price: product.price,
        strikePrice: product.strikePrice || 0,
        stockQuantity: product.stockQuantity,
        sku: product.sku,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
      });

      // Handle images
      // If product.images is array of strings (urls), set them.
      // Note: ImageUpload expects strings for preview.
      // If product has 'image' (single) and 'media' (array), we need to combine or handle.
      // Assuming product.images or product.media exists.
      // Based on type definition: media?: string[]; image: string;
      const initialImages =
        product.media || (product.image ? [product.image] : []);
      setImages(initialImages);
      setFiles([]); // Reset files as we don't have File objects for existing images

      // Handle specifications
      setSpecifications(product.specifications || []);
    }
  }, [product, open, reset]);


  const selectedCategorySlug = watch("category");

  const subCategories = useMemo(() => {
    const subs: { [key: string]: string[] } = {
      electronics: ["Audio", "Wearables", "PC Accessories"],
      fashion: ["Apparel", "Footwear", "Accessories"],
      "home-kitchen": ["Kitchen", "Bedroom", "Living Room"],
      beauty: ["Skincare", "Haircare", "Makeup"],
      sports: ["Equipment", "Apparel", "Accessories"],
      toys: ["Dolls", "Action Figures", "Educational"],
      books: ["Fiction", "Non-Fiction", "Educational"],
      gaming: ["Consoles", "Games", "Accessories"],
    };
    return subs[selectedCategorySlug] || [];
  }, [selectedCategorySlug]);

  const handleAddSpec = () => {
    if (specKey && specValue) {
      setSpecifications([
        ...specifications,
        { key: specKey, value: specValue },
      ]);
      setSpecKey("");
      setSpecValue("");
    }
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    if (!product?._id) {
      toast.error("Product ID is missing");
      return;
    }

    try {
      const formData = new FormData();

      // Append product data as JSON string
      const productData = {
        ...data,
        specifications,
      };
      formData.append("data", JSON.stringify(productData));

      // Append new images (File objects)
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Separate existing images (URLs that start with http/https or data:)
      const existingImages = images.filter(
        (img) => img.startsWith("http") || img.startsWith("data:")
      );

      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Call updateProduct service with product _id
      const result = await updateProduct(product._id, formData);

      if (result?.success || result?.data) {
        toast.success("Product updated successfully!");
        if (onSuccess) onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(result?.message || "Failed to update product");
      }
    } catch (error: unknown) {
      console.error("Error updating product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      toast.error(errorMessage);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <AlertDialogHeader className="p-6 border-b">
          <AlertDialogTitle>Edit Product</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your product here. Click save when you&apos;re done.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="edit-product-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Images</h3>
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                onFilesChange={setFiles}
                maxImages={5}
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Product Title *</label>
                <Input {...register("title")} className="mt-1" />
                {errors.title && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Category *</label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Sub-Category *</label>
                <Controller
                  name="subCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedCategorySlug}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subCategory && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.subCategory.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">SKU *</label>
                <Input {...register("sku")} className="mt-1 uppercase" />
                {errors.sku && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.sku.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Short Description *
                </label>
                <Textarea
                  {...register("shortDescription")}
                  className="mt-1 h-20 resize-none"
                />
                {errors.shortDescription && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Long Description *
                </label>
                <Textarea
                  {...register("longDescription")}
                  className="mt-1 h-32 resize-none"
                />
                {errors.longDescription && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.longDescription.message}
                  </p>
                )}
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Selling Price ($) *
                </label>
                <Input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="mt-1"
                />
                {errors.price && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">
                  Original Price ($)
                </label>
                <Input
                  {...register("strikePrice", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="mt-1"
                />
                {errors.strikePrice && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.strikePrice.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Stock Quantity *</label>
                <Input
                  {...register("stockQuantity", { valueAsNumber: true })}
                  type="number"
                  className="mt-1"
                />
                {errors.stockQuantity && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Specifications</h3>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{spec.key}</p>
                      <p className="text-xs text-muted-foreground">
                        {spec.value}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Key"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                />
                <Input
                  placeholder="Value"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSpec}
                disabled={!specKey || !specValue}
                className="w-full"
              >
                Add Specification
              </Button>
            </div>
          </form>
        </div>

        <div className="p-6 border-t bg-background flex justify-end gap-3">
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <Button
            type="submit"
            form="edit-product-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
