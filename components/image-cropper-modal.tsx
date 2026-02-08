"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  onCropComplete: (croppedImageUrl: string) => void
  aspectRatio?: number
}

export default function ImageCropperModal({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio = 3 / 1, // Default aspect ratio for cover photo
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100 / aspectRatio,
    x: 0,
    y: 0,
  })
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset crop when image changes
  useEffect(() => {
    setCrop({
      unit: "%",
      width: 100,
      height: 100 / aspectRatio,
      x: 0,
      y: 0,
    })
    setRotation(0)
  }, [imageUrl, aspectRatio])

  // Close modal when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const getCroppedImg = () => {
    setIsLoading(true)

    try {
      const image = imgRef.current
      if (!image) {
        throw new Error("No image found")
      }

      const canvas = document.createElement("canvas")
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      // Calculate dimensions based on crop and rotation
      const rotationRad = (rotation * Math.PI) / 180

      // Adjust canvas size based on rotation
      let canvasWidth = image.width
      let canvasHeight = image.height

      if (rotation === 90 || rotation === 270) {
        canvasWidth = image.height
        canvasHeight = image.width
      }

      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Move to center of canvas
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // Rotate around the center
      ctx.rotate(rotationRad)

      // Draw the image at the correct position
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height,
      )

      // Convert canvas to blob URL
      const croppedImageUrl = canvas.toDataURL("image/jpeg")
      onCropComplete(croppedImageUrl)
      onClose()
    } catch (error) {
      console.error("Error cropping image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClickOutside}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Crop Image</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-muted/30">
              <div className="relative max-w-full max-h-[60vh] overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={aspectRatio}
                  className="max-w-full max-h-[60vh]"
                >
                  <img
                    ref={imgRef}
                    src={imageUrl || "/placeholder.svg"}
                    alt="Crop preview"
                    style={{ transform: `rotate(${rotation}deg)`, maxWidth: "100%", maxHeight: "60vh" }}
                    crossOrigin="anonymous"
                  />
                </ReactCrop>
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center">
              <Button type="button" variant="outline" onClick={rotateImage} disabled={isLoading}>
                <RotateCw className="size-4 mr-2" />
                Rotate
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="button" onClick={getCroppedImg} disabled={isLoading}>
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Check className="size-4 mr-2" />
                      Apply
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
