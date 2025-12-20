"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ICarouselSlide, GRADIENT_OPTIONS } from "@/types/carousel";
import { updateCarouselSlide } from "@/services/carousel";
import { toast } from "sonner";
import SlidePreview from "./slide-preview";
import { Loader2 } from "lucide-react";

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

interface EditSlideModalProps {
  open: boolean;
  onClose: () => void;
  slide: ICarouselSlide;
  onSlideUpdated: (slide: ICarouselSlide) => void;
}

export default function EditSlideModal({
  open,
  onClose,
  slide,
  onSlideUpdated,
}: EditSlideModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(slide.image || "");

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
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge,
      badgeSubtext: slide.badgeSubtext,
      bgColor: slide.bgColor,
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
    },
  });

  useEffect(() => {
    reset({
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge,
      badgeSubtext: slide.badgeSubtext,
      bgColor: slide.bgColor,
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
    });
    setImagePreview(slide.image || "");
    setImageFile(null);
  }, [slide, reset]);

  const watchedValues = watch();

  const previewSlide: ICarouselSlide = {
    ...slide,
    title: watchedValues.title || slide.title,
    subtitle: watchedValues.subtitle || slide.subtitle,
    badge: watchedValues.badge || slide.badge,
    badgeSubtext: watchedValues.badgeSubtext || slide.badgeSubtext,
    bgColor: watchedValues.bgColor || slide.bgColor,
    image: imagePreview || slide.image,
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
      const slideId = slide._id || slide.id || "";
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("badge", data.badge);
      formData.append("badgeSubtext", data.badgeSubtext);
      formData.append("bgColor", data.bgColor);
      formData.append("order", String(slide.order));

      if (data.buttonText) formData.append("buttonText", data.buttonText);
      if (data.buttonLink) formData.append("buttonLink", data.buttonLink);
      if (imageFile) formData.append("image", imageFile);

      const result = await updateCarouselSlide(slideId, formData);
      const updatedSlide = result.data || { ...slide, ...data };

      toast.success("Slide updated successfully!");
      onSlideUpdated(updatedSlide);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update slide");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>✏️</span> Edit Carousel Slide
          </DialogTitle>
          <DialogDescription>
            Update the slide content and appearance
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
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
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
              <Label htmlFor="edit-subtitle">Subtitle *</Label>
              <Input
                id="edit-subtitle"
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
              <Label htmlFor="edit-badge">Badge Text *</Label>
              <Input
                id="edit-badge"
                placeholder="20% OFF"
                {...register("badge")}
              />
              {errors.badge && (
                <p className="text-sm text-destructive">
                  {errors.badge.message}
                </p>
              )}
            </div>

            {/* Badge Subtext */}
            <div className="space-y-2">
              <Label htmlFor="edit-badgeSubtext">Badge Subtext *</Label>
              <Input
                id="edit-badgeSubtext"
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
                value={watchedValues.bgColor}
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
              <Label htmlFor="edit-image">Background Image (Optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {slide.image && !imageFile && (
                <p className="text-xs text-muted-foreground">
                  Current image will be kept if no new image selected
                </p>
              )}
            </div>

            {/* Button Text */}
            <div className="space-y-2">
              <Label htmlFor="edit-buttonText">Button Text (Optional)</Label>
              <Input
                id="edit-buttonText"
                placeholder="Shop Now"
                {...register("buttonText")}
              />
            </div>

            {/* Button Link */}
            <div className="space-y-2">
              <Label htmlFor="edit-buttonLink">Button Link (Optional)</Label>
              <Input
                id="edit-buttonLink"
                placeholder="/products"
                {...register("buttonLink")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
