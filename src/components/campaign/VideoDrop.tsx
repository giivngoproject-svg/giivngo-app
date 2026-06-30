"use client";

import { useEffect, useRef, useState } from "react";
import { Video, Upload, Square, X, Circle } from "lucide-react";
import { uploadVideo } from "@/lib/mock/storage";
import { toast } from "@/stores/toast";

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
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busy, setBusy] = useState(false);

  const previewRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => stopStream, []);

  const handleUpload = async (file: File) => {
    if (file.size > MAX_BYTES) {
      toast.error("Video too large", "Keep it under 25 MB");
      return;
    }
    setBusy(true);
    try {
      onChange(await uploadVideo(file));
    } finally {
      setBusy(false);
    }
  };

  const startRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Recording unavailable", "Upload a video instead");
      return;
    }
    try {
      setRecording(true);
      setElapsed(0);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        previewRef.current.play().catch(() => {});
      }

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stopStream();
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "video/webm" });
        setBusy(true);
        try {
          onChange(await uploadVideo(blob));
        } finally {
          setBusy(false);
        }
      };
      recorderRef.current = recorder;
      recorder.start();

      timerRef.current = setInterval(() => {
        setElapsed((s) => {
          if (s + 1 >= MAX_SECONDS) stopRecording();
          return s + 1;
        });
      }, 1000);
    } catch {
      setRecording(false);
      toast.error("Camera blocked", "Allow camera access or upload a video instead");
      stopStream();
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  };

  if (value) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1.5">Video message</label>
        <div className="relative rounded-2xl overflow-hidden border border-border">
          <video src={value} controls playsInline className="w-full max-h-56 object-cover bg-black" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full shadow-soft hover:bg-background"
            aria-label="Remove video"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Add a video (optional)</label>

      {recording ? (
        <div className="rounded-2xl border border-border overflow-hidden">
          <video ref={previewRef} autoPlay muted playsInline className="w-full max-h-56 object-contain bg-black" />
          <div className="flex items-center justify-between p-2.5">
            <span className="text-sm text-red-600 inline-flex items-center gap-1.5">
              <Circle size={10} className="fill-red-600 animate-pulse" />
              {elapsed}s / {MAX_SECONDS}s
            </span>
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 h-9 rounded-xl bg-foreground text-background"
            >
              <Square size={13} /> Stop
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={startRecording}
            disabled={busy}
            className="flex items-center justify-center gap-2 h-11 rounded-2xl border border-border text-sm text-muted hover:text-foreground hover:bg-foreground/[.02] disabled:opacity-50"
          >
            <Video size={15} /> Record
          </button>
          <label className="flex items-center justify-center gap-2 h-11 rounded-2xl border border-dashed border-border text-sm text-muted hover:text-foreground hover:bg-foreground/[.02] cursor-pointer">
            <Upload size={15} />
            {busy ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
