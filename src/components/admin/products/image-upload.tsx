"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback(
    (files: FileList) => {
      setError("")
      const fileArray = Array.from(files)

      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed")
          return false
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be less than 5MB")
          return false
        }
        return true
      })

      if (images.length + validFiles.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`)
        return
      }

      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            onImagesChange([...images, e.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [images, maxImages, onImagesChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20"
            : "border-muted-foreground/30 hover:border-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/10"
        }`}
      >
        <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" id="image-input" />
        <label htmlFor="image-input" className="flex flex-col items-center justify-center cursor-pointer gap-3">
          <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-2xl">⬆️</div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Drag and drop images here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {images.length} / {maxImages} images ({maxImages - images.length} remaining)
          </p>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <span className="text-lg shrink-0">⚠️</span>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Uploaded Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg"
                >
                  ✕
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium bg-rose-500 text-white">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
