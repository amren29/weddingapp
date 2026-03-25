"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, ImageIcon, X } from "lucide-react";

interface GalleryImageItem {
  id: string;
  uploadedBy: string;
  fileUrl: string;
  caption: string | null;
  createdAt: string;
}

interface PhotoGalleryProps {
  weddingId: string;
  isAdmin?: boolean;
  allowUpload?: boolean;
}

export function PhotoGallery({ weddingId, isAdmin = false, allowUpload = true }: PhotoGalleryProps) {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    const res = await fetch(`/api/gallery/${weddingId}`);
    if (res.ok) setImages(await res.json());
  }, [weddingId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !name) {
      toast.error("Please enter your name first");
      return;
    }
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("uploadedBy", name);

      const res = await fetch(`/api/gallery/${weddingId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) toast.error(`Failed to upload ${file.name}`);
    }

    toast.success("Photos uploaded!");
    setUploading(false);
    fetchImages();
  };

  return (
    <div className="space-y-6">
      {allowUpload && !isAdmin && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-rose-300 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload photos</p>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files)}
                disabled={uploading || !name}
              />
            </label>
            {uploading && <p className="text-sm text-center text-muted-foreground">Uploading...</p>}
          </CardContent>
        </Card>
      )}

      {images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
          <p>No photos yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(img.fileUrl)}
            >
              <img
                src={img.fileUrl}
                alt={`Photo by ${img.uploadedBy}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-2">
                <p className="text-white text-xs">{img.uploadedBy}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
