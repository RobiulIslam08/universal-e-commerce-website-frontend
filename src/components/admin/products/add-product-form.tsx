"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./image-upload";
import { addProduct } from "@/services/product";
import { toast } from "sonner";
import { getRootCategories, getSubCategories } from "@/services/category";
import { ICategoryWithCount } from "@/types/category";
import { Loader2 } from "lucide-react";

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

export default function AddProductForm() {
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [specifications, setSpecifications] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  // Category states
  const [categories, setCategories] = useState<ICategoryWithCount[]>([]);
  const [subCategories, setSubCategories] = useState<ICategoryWithCount[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      sku: "",
      shortDescription: "",
      longDescription: "",
      price: 0,
      strikePrice: 0,
      stockQuantity: 0,
    },
  });

  const selectedCategorySlug = watch("category");

  // Fetch root categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
      
        const data = await getRootCategories();
        setCategories(data);

        if (data.length === 0) {
          toast.warning("No categories found. Please add categories first.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(
          "Failed to load categories. Please check your backend connection."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategorySlug) {
        setSubCategories([]);
        setValue("subCategory", "");
        return;
      }

      setLoadingSubCategories(true);
      try {
        console.log(`Fetching subcategories for: ${selectedCategorySlug}`);
        const data = await getSubCategories(selectedCategorySlug);
        console.log("Subcategories received:", data);
        setSubCategories(data);
        setValue("subCategory", ""); // Reset subcategory when category changes

        if (data.length === 0) {
          toast.info(`No subcategories found for this category.`);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories");
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, [selectedCategorySlug, setValue]);

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

    try {
      const formData = new FormData();

      // Append product data as JSON string
      const productData = {
        ...data,
        specifications,
      };
      formData.append("data", JSON.stringify(productData));

      // Append images
      files.forEach((file) => {
        formData.append("images", file);
      });

      await addProduct(formData);

      setSubmitted(true);
      toast.success("Product added successfully!");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add product");
      }
    }
  };

  const onError = (errors: unknown) => {
    console.log("Validation Errors:", errors);
    toast.error("Please check the form for errors");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {submitted && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
          <span className="text-xl shrink-0">✓</span>
          <div>
            <p className="font-semibold text-green-900 dark:text-green-200">
              Product Added Successfully!
            </p>
            <p className="text-sm text-green-800 dark:text-green-300">
              Your product has been added to the catalog.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card className="border-border bg-linear-to-br from-rose-50/50 to-transparent dark:from-rose-950/10 dark:to-transparent">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload at least one image and up to 5 images for your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              onFilesChange={setFiles}
              maxImages={5}
            />
            {images.length === 0 && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <span className="text-xl shrink-0">⚠</span> At least one image
                is required
              </p>
            )}
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details of your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Product Title *
              </label>
              <Input
                {...register("title")}
                placeholder="e.g., Premium Wireless Headphones"
                className="mt-1 bg-input border-border"
              />
              {errors.title && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <span className="text-xl shrink-0">⚠</span>{" "}
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Category *
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingCategories}
                    >
                      <SelectTrigger className="mt-1 bg-input border-border">
                        <SelectValue
                          placeholder={
                            loadingCategories
                              ? "Loading categories..."
                              : "Select category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingCategories ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        ) : categories.length === 0 ? (
                          <div className="text-sm text-muted-foreground text-center py-2">
                            No categories available
                          </div>
                        ) : (
                          categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat.slug}>
                              {cat.name} ({cat.productCount})
                            </SelectItem>
                          ))
                        )}
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
                <label className="text-sm font-medium text-foreground">
                  Sub-Category *
                </label>
                <Controller
                  name="subCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedCategorySlug || loadingSubCategories}
                    >
                      <SelectTrigger className="mt-1 bg-input border-border">
                        <SelectValue
                          placeholder={
                            !selectedCategorySlug
                              ? "Select category first"
                              : loadingSubCategories
                              ? "Loading subcategories..."
                              : "Select sub-category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingSubCategories ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        ) : subCategories.length === 0 ? (
                          <div className="text-sm text-muted-foreground text-center py-2">
                            No subcategories available
                          </div>
                        ) : (
                          subCategories.map((sub) => (
                            <SelectItem key={sub._id} value={sub.slug}>
                              {sub.name} ({sub.productCount})
                            </SelectItem>
                          ))
                        )}
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
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                SKU (Stock Keeping Unit) *
              </label>
              <Input
                {...register("sku")}
                placeholder="e.g., ELEC-HP-001"
                className="mt-1 bg-input border-border uppercase"
              />
              {errors.sku && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <span className="text-xl shrink-0">⚠</span>{" "}
                  {errors.sku.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Use uppercase letters, numbers, and hyphens only
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Short Description *
              </label>
              <Textarea
                {...register("shortDescription")}
                placeholder="Brief product description (10-100 characters)"
                className="mt-1 bg-input border-border resize-none h-20"
              />
              {errors.shortDescription && (
                <p className="text-xs text-destructive mt-1">
                  {errors.shortDescription.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Long Description *
              </label>
              <Textarea
                {...register("longDescription")}
                placeholder="Detailed product description with specifications"
                className="mt-1 bg-input border-border resize-none h-32"
              />
              {errors.longDescription && (
                <p className="text-xs text-destructive mt-1">
                  {errors.longDescription.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>
              Set your product price and stock information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Selling Price ($) *
                </label>
                <Input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="mt-1 bg-input border-border"
                />
                {errors.price && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Original Price ($)
                </label>
                <Input
                  {...register("strikePrice", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="mt-1 bg-input border-border"
                />
                {errors.strikePrice && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.strikePrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Stock Quantity *
                </label>
                <Input
                  {...register("stockQuantity", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="mt-1 bg-input border-border"
                />
                {errors.stockQuantity && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.stockQuantity.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>
              Add product specifications (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-linear-to-r from-rose-50/50 to-transparent dark:from-rose-950/10 rounded-lg border border-border hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {spec.key}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {spec.value}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    <span className="text-xl text-red-600 dark:text-red-400">
                      ✗
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Spec key (e.g., Material)"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className="bg-input border-border"
              />
              <Input
                placeholder="Spec value (e.g., Premium Aluminum)"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                className="bg-input border-border"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddSpec}
              disabled={!specKey || !specValue}
              className="gap-2 w-full md:w-auto bg-transparent border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/20"
            >
              <span className="text-xl">+</span>
              Add Specification
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || images.length === 0}
            className="bg-rose-600 hover:bg-rose-700 text-white gap-2"
          >
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-border bg-transparent hover:bg-muted"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
