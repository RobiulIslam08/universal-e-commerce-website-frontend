"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { ICarouselSlide, GRADIENT_OPTIONS } from "@/types/carousel";
import { addCarouselSlide } from "@/services/carousel";
import { toast } from "sonner";
import SlidePreview from "./slide-preview";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const slideSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subtitle: z.string().min(3, "Subtitle must be at least 3 characters"),
  badge: z.string().min(1, "Badge text is required"),
  badgeSubtext: z.string().min(1, "Badge subtext is required"),
  bgColor: z.string().min(1, "Background color is required"),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
});

type SlideFormData = z.infer<typeof slideSchema>;

interface AddSlideModalProps {
  open: boolean;
  onClose: () => void;
  onSlideAdded: (slide: ICarouselSlide) => void;
  nextOrder: number;
}

export default function AddSlideModal({
  open,
  onClose,
  onSlideAdded,
  nextOrder,
}: AddSlideModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SlideFormData>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      bgColor: GRADIENT_OPTIONS[0].value,
    },
  });

  const watchedValues = watch();

  const previewSlide: ICarouselSlide = {
    title: watchedValues.title || "Your Title Here",
    subtitle: watchedValues.subtitle || "Your Subtitle",
    badge: watchedValues.badge || "Badge Text",
    badgeSubtext: watchedValues.badgeSubtext || "Badge Subtext",
    bgColor: watchedValues.bgColor || GRADIENT_OPTIONS[0].value,
    image: imagePreview,
    isActive: true,
    order: nextOrder,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SlideFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("badge", data.badge);
      formData.append("badgeSubtext", data.badgeSubtext);
      formData.append("bgColor", data.bgColor);
      formData.append("isActive", "true");
      formData.append("order", String(nextOrder));

      if (data.buttonText) formData.append("buttonText", data.buttonText);
      if (data.buttonLink) formData.append("buttonLink", data.buttonLink);
      if (imageFile) formData.append("image", imageFile);

      const result = await addCarouselSlide(formData);
      const newSlide = result.data || result;

      toast.success("Slide added successfully!");
      onSlideAdded(newSlide);
      reset();
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add slide");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImagePreview("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>🎨</span> Add New Carousel Slide
          </DialogTitle>
          <DialogDescription>
            Create a new slide for your homepage carousel
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Live Preview */}
          <div className="space-y-2">
            <Label>Live Preview</Label>
            <SlidePreview slide={previewSlide} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Welcome to Our Store"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                placeholder="Shop now and get"
                {...register("subtitle")}
              />
              {errors.subtitle && (
                <p className="text-sm text-destructive">
                  {errors.subtitle.message}
                </p>
              )}
            </div>

            {/* Badge */}
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Text *</Label>
              <Input id="badge" placeholder="20% OFF" {...register("badge")} />
              {errors.badge && (
                <p className="text-sm text-destructive">
                  {errors.badge.message}
                </p>
              )}
            </div>

            {/* Badge Subtext */}
            <div className="space-y-2">
              <Label htmlFor="badgeSubtext">Badge Subtext *</Label>
              <Input
                id="badgeSubtext"
                placeholder="on First order*"
                {...register("badgeSubtext")}
              />
              {errors.badgeSubtext && (
                <p className="text-sm text-destructive">
                  {errors.badgeSubtext.message}
                </p>
              )}
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label>Background Gradient *</Label>
              <Select
                defaultValue={GRADIENT_OPTIONS[0].value}
                onValueChange={(value) => setValue("bgColor", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a gradient" />
                </SelectTrigger>
                <SelectContent>
                  {GRADIENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${option.value}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bgColor && (
                <p className="text-sm text-destructive">
                  {errors.bgColor.message}
                </p>
              )}
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Background Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground">
                Image will overlay with the gradient
              </p>
            </div>

            {/* Button Text */}
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text (Optional)</Label>
              <Input
                id="buttonText"
                placeholder="Shop Now"
                {...register("buttonText")}
              />
            </div>

            {/* Button Link */}
            <div className="space-y-2">
              <Label htmlFor="buttonLink">Button Link (Optional)</Label>
              <Input
                id="buttonLink"
                placeholder="/products"
                {...register("buttonLink")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-linear-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-700"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Slide
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
