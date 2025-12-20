"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICarouselSlide, GRADIENT_OPTIONS } from "@/types/carousel";
import { toast } from "sonner";
import {
  deleteCarouselSlide,
  toggleCarouselSlideStatus,
} from "@/services/carousel";

import { Plus, Eye, EyeOff, Pencil, Trash2, GripVertical } from "lucide-react";
import AddSlideModal from "./add-slide-modal";
import EditSlideModal from "./edit-slide-modal";
import SlidePreview from "./slide-preview";

interface CarouselClientProps {
  initialSlides: ICarouselSlide[];
}

export default function CarouselClient({ initialSlides }: CarouselClientProps) {
  const [slides, setSlides] = useState<ICarouselSlide[]>(initialSlides);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<ICarouselSlide | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (slideId: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    setLoading(slideId);
    try {
      await deleteCarouselSlide(slideId);
      setSlides((prev) => prev.filter((s) => (s._id || s.id) !== slideId));
      toast.success("Slide deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete slide");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleToggleStatus = async (
    slideId: string,
    currentStatus: boolean
  ) => {
    setLoading(slideId);
    try {
      await toggleCarouselSlideStatus(slideId, !currentStatus);
      setSlides((prev) =>
        prev.map((s) =>
          (s._id || s.id) === slideId ? { ...s, isActive: !currentStatus } : s
        )
      );
      toast.success(
        `Slide ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      toast.error("Failed to update slide status");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleSlideAdded = (newSlide: ICarouselSlide) => {
    setSlides((prev) => [...prev, newSlide]);
    setShowAddModal(false);
  };

  const handleSlideUpdated = (updatedSlide: ICarouselSlide) => {
    setSlides((prev) =>
      prev.map((s) =>
        (s._id || s.id) === (updatedSlide._id || updatedSlide.id)
          ? updatedSlide
          : s
      )
    );
    setEditingSlide(null);
  };

  const getGradientLabel = (value: string) => {
    const option = GRADIENT_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total Slides: <span className="font-semibold">{slides.length}</span> |
          Active:{" "}
          <span className="font-semibold text-green-600">
            {slides.filter((s) => s.isActive).length}
          </span>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="gap-2 bg-linear-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-700 text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🎠</div>
            <h3 className="text-xl font-semibold mb-2">No Slides Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first carousel slide to get started
            </p>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Slide
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {slides
            .sort((a, b) => a.order - b.order)
            .map((slide, index) => {
              const slideId = slide._id || slide.id || "";
              return (
                <Card
                  key={slideId}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    !slide.isActive ? "opacity-60" : ""
                  }`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab p-1 hover:bg-muted rounded">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span className="text-muted-foreground">
                            #{index + 1}
                          </span>
                          {slide.title}
                          {!slide.isActive && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              Hidden
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getGradientLabel(slide.bgColor)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleToggleStatus(slideId, slide.isActive)
                        }
                        disabled={loading === slideId}
                        title={slide.isActive ? "Hide slide" : "Show slide"}
                      >
                        {slide.isActive ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingSlide(slide)}
                        disabled={loading === slideId}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(slideId)}
                        disabled={loading === slideId}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <SlidePreview slide={slide} />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Subtitle:</span>
                        <p className="font-medium truncate">{slide.subtitle}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Badge:</span>
                        <p className="font-medium truncate">{slide.badge}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Badge Subtext:
                        </span>
                        <p className="font-medium truncate">
                          {slide.badgeSubtext}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Button Link:
                        </span>
                        <p className="font-medium truncate">
                          {slide.buttonLink || "None"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Add Slide Modal */}
      <AddSlideModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSlideAdded={handleSlideAdded}
        nextOrder={slides.length + 1}
      />

      {/* Edit Slide Modal */}
      {editingSlide && (
        <EditSlideModal
          open={!!editingSlide}
          onClose={() => setEditingSlide(null)}
          slide={editingSlide}
          onSlideUpdated={handleSlideUpdated}
        />
      )}
    </div>
  );
}
