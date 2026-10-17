"use client";

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { Camera, Video as VideoIcon, X } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { uploadVideo } from "@/lib/mock/storage";
import { VideoRecorder } from "@/components/media/VideoRecorder";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_SECONDS = 15;

const GHOST =
  "flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background text-sm font-semibold transition-colors hover:bg-foreground/[.02] disabled:opacity-50";

/** Photo and video attachments for a contribution, styled like the contribute mockup. */
export function MediaAttach({
  photo,
  video,
  onPhotoFile,
  onPhotoRemove,
  onVideoChange,
}: {
  photo?: string;
  video?: string;
  onPhotoFile: (file: File) => void | Promise<void>;
  onPhotoRemove: () => void;
  onVideoChange: (url?: string) => void;
}) {
  const t = useTranslation();
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);

  // Asks whether to record a video or pick one from the device.
  const chooseVideo = async () => {
    const choice = await Swal.fire({
      title: t("campaign.media.video_choose_title"),
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: t("campaign.media.record"),
      denyButtonText: t("campaign.media.upload"),
      cancelButtonText: t("common.cancel"),
      confirmButtonColor: "#1E1B4B",
      denyButtonColor: "#1E1B4B",
    });
    if (choice.isConfirmed) setRecording(true);
    else if (choice.isDenied) videoInput.current?.click();
  };

  const saveVideo = async (file: File) => {
    if (file.size > MAX_BYTES) {
      await Swal.fire({ title: t("campaign.media.video_too_large"), icon: "error", confirmButtonColor: "#1E1B4B" });
      return;
    }
    setBusy(true);
    try {
      onVideoChange(await uploadVideo(file));
    } finally {
      setBusy(false);
    }
  };

  if (recording) {
    return (
      <VideoRecorder
        variant="inline"
        maxDurationSeconds={MAX_SECONDS}
        maxBytes={MAX_BYTES}
        onConfirm={async (blob) => {
          setRecording(false);
          await saveVideo(new File([blob], "recording.webm", { type: blob.type }));
        }}
        onCancel={() => setRecording(false)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" disabled={busy} onClick={() => photoInput.current?.click()} className={GHOST}>
          <Camera size={18} />
          {t("campaign.media.add_photo")}
        </button>
        <button type="button" disabled={busy} onClick={chooseVideo} className={GHOST}>
          <VideoIcon size={18} />
          {t("campaign.media.add_video")}
        </button>
      </div>
      <p className="text-xs text-muted">
        {t("campaign.media.hint")}
      </p>

      <input
        ref={photoInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onPhotoFile(f);
          e.target.value = "";
        }}
      />
      <input
        ref={videoInput}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void saveVideo(f);
          e.target.value = "";
        }}
      />

      {photo && (
        <div className="flex items-center gap-3 rounded-2xl border border-border p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" className="h-12 w-12 rounded-xl object-cover" />
          <p className="flex-1 text-sm text-muted">{t("campaign.media.photo_attached")}</p>
          <button type="button" onClick={onPhotoRemove} className="text-xs text-muted hover:text-foreground">
            {t("campaign.media.remove")}
          </button>
        </div>
      )}

      {video && (
        <div className="relative overflow-hidden rounded-2xl bg-black">
          <video src={video} controls className="max-h-48 w-full" />
          <button
            type="button"
            onClick={() => onVideoChange(undefined)}
            className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white hover:bg-red-700"
            aria-label={t("campaign.media.remove")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
