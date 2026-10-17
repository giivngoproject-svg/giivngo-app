"use client";

import { uploadImage } from "@/lib/mock/storage";
import { useTranslation } from "@/lib/useTranslation";
import { toast } from "@/stores/toast";
import { MediaAttach } from "@/components/campaign/MediaAttach";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

/** Cover photo or video for the create flow: dashed box with help text and two buttons, as in the mockup. */
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

  const handlePhoto = async (file: File) => {
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error(t("common.error"));
      return;
    }
    onPhotoChange(await uploadImage(file));
  };

  return (
    <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-dashed border-[#C9C5D3] bg-foreground/[.03] p-[18px] text-center">
      <p className="text-sm text-muted">{t("wizard.cover.help")}</p>
      <div className="w-full">
        <MediaAttach
          photo={photoUrl}
          video={videoUrl}
          onPhotoFile={handlePhoto}
          onPhotoRemove={() => onPhotoChange(undefined)}
          onVideoChange={onVideoChange}
          variant="solid"
          hideHint
        />
      </div>
    </div>
  );
}
