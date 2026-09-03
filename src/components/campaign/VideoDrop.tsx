"use client";

import { useRef, useState } from "react";
import { Video, Upload, X } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { uploadVideo } from "@/lib/mock/storage";
import { toast } from "@/stores/toast";
import { VideoRecorder } from "@/components/media/VideoRecorder";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_SECONDS = 15;

/** Attach a short video to a contribution — upload a file or record in-browser. */
export function VideoDrop({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url?: string) => void;
}) {
  const t = useTranslation();
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (file.size > MAX_BYTES) {
      toast.error(t("common.error"));
      return;
    }
    setBusy(true);
    try {
      onChange(await uploadVideo(file));
    } finally {
      setBusy(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRecordConfirm = async (blob: Blob, preview: string) => {
    setBusy(true);
    try {
      const file = new File([blob], "recording.webm", { type: blob.type });
      await handleUpload(file);
      setRecording(false);
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
        onConfirm={handleRecordConfirm}
        onCancel={() => setRecording(false)}
      />
    );
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            src={value}
            controls
            className="w-full max-h-64"
          />
          <button
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!value && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-3">
          <Video className="w-10 h-10 mx-auto text-gray-400" />
          <p className="text-sm text-gray-600">
            Record or upload a short video (max {MAX_SECONDS}s, {(MAX_BYTES / 1024 / 1024).toFixed(0)}MB)
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setRecording(true)}
              disabled={busy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              Record Video
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Upload Video
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
