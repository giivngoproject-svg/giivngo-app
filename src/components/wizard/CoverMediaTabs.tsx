"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/useTranslation";
import { PhotoUpload } from "@/components/wizard/PhotoUpload";
import { VideoUpload } from "@/components/wizard/VideoUpload";
import { Image, Video, CheckCircle2 } from "lucide-react";

export function CoverMediaTabs({
  photoUrl,
  videoUrl,
  onPhotoChange,
  onVideoChange,
}: {
  photoUrl?: string;
  videoUrl?: string;
  onPhotoChange: (url?: string) => void;
  onVideoChange: (url?: string) => void;
}) {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("photo")}
          className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "photo"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          <Image size={18} />
          {t("wizard.cover_photo_tab")}
          {photoUrl && <CheckCircle2 size={16} className="text-green-600 ml-1" />}
        </button>

        <button
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "video"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          <Video size={18} />
          {t("wizard.cover_video_tab")}
          {videoUrl && <CheckCircle2 size={16} className="text-green-600 ml-1" />}
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "photo" && (
          <PhotoUpload value={photoUrl} onChange={onPhotoChange} />
        )}

        {activeTab === "video" && (
          <VideoUpload value={videoUrl} onChange={onVideoChange} />
        )}
      </div>
    </div>
  );
}
