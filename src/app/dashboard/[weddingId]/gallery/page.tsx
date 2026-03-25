"use client";

import { useParams } from "next/navigation";
import { PhotoGallery } from "@/components/wedding/photo-gallery";

export default function DashboardGalleryPage() {
  const params = useParams();
  const weddingId = params.weddingId as string;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Photo Gallery</h1>
      <PhotoGallery weddingId={weddingId} isAdmin allowUpload={false} />
    </div>
  );
}
