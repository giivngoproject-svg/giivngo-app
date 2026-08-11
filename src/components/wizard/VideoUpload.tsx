"use client";

import { useRef, useState, useEffect } from "react";
import { Video, X, Mic, StopCircle, Upload } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { uploadVideo } from "@/lib/mock/storage";
import { toast } from "@/stores/toast";

export function VideoUpload({
  value,
  onChange,
  label = "Campaign video",
  className = "",
}: {
  value?: string;
  onChange: (url?: string) => void;
  label?: string;
  className?: string;
}) {
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"select" | "record">("select");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [preview, setPreview] = useState<string | undefined>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_DURATION = 60; // 1 minute in seconds
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Upload video file
  const pickFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Video must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    // Quick duration check using video element
    const video = document.createElement("video");
    video.onloadedmetadata = async () => {
      if (video.duration > MAX_DURATION) {
        toast.error(`Video must be shorter than ${MAX_DURATION} seconds`);
        return;
      }

      setBusy(true);
      try {
        const url = await uploadVideo(file);
        onChange(url);
        setMode("select");
      } finally {
        setBusy(false);
      }
    };
    video.src = URL.createObjectURL(file);
  };

  // Attach stream to video when modal is shown
  useEffect(() => {
    console.log('useEffect fired:', { isRecording, hasStream: !!streamRef.current, hasVideoRef: !!previewVideoRef.current });

    if (isRecording && streamRef.current && previewVideoRef.current) {
      console.log('useEffect: Attaching stream to video element');
      previewVideoRef.current.srcObject = streamRef.current;
      previewVideoRef.current.play().catch((err) => {
        console.error('Error playing video:', err);
      });
    }
  }, [isRecording]);

  // Start recording
  const startRecording = async () => {
    try {
      console.log('Starting recording...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      console.log('Stream obtained:', stream);
      streamRef.current = stream;

      // Trigger state update which will render the modal
      // The useEffect will handle attaching the stream to the video element
      console.log('Setting isRecording to true');
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      console.log('State set, modal should render now');

      const mimeType = MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
      });

      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        const blob = new Blob(chunks, { type: mimeType });
        const previewUrl = URL.createObjectURL(blob);
        setPreview(previewUrl);

        // Save for upload
        const file = new File([blob], "recording.webm", { type: mimeType });
        await pickFile(file);
      };

      mediaRecorderRef.current.start();

      // Countdown timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION - 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('Recording error:', error);
      const errorMsg = error?.name === 'NotAllowedError'
        ? 'Camera/microphone access denied. Please allow permissions in your browser.'
        : error?.name === 'NotFoundError'
        ? 'No camera/microphone found on your device.'
        : 'Unable to access camera/microphone. Check permissions.';

      toast.error(errorMsg);
      setIsRecording(false);
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION - 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    // Stop all tracks from stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const resetRecording = () => {
    // Cleanup stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setRecordingTime(0);
    setPreview(undefined);
    setMode("select");
  };

  // Recording mode - FULLSCREEN MODAL (MUST CHECK BEFORE mode === "select")
  if (isRecording) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        {/* Main camera preview - LARGE BLACK BOX */}
        <div className="w-full max-w-3xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-accent mb-8 relative">
          <video
            ref={previewVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Recording indicator - TOP LEFT */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            <span className="font-semibold">Recording</span>
          </div>

          {/* Timer - CENTER TOP */}
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <div className={`px-6 py-3 rounded-xl flex items-center gap-3 backdrop-blur-sm font-mono font-bold text-2xl text-white ${
              isPaused
                ? 'bg-yellow-600/90'
                : 'bg-red-600/90'
            }`}>
              <div className={`w-4 h-4 rounded-full ${isPaused ? '' : 'animate-pulse'}`} style={{
                backgroundColor: 'white',
                opacity: isPaused ? 0.5 : 1
              }} />
              <span>
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
              {isPaused && <span className="text-base ml-2 font-semibold">(PAUSED)</span>}
            </div>
          </div>
        </div>

        {/* Control buttons - BELOW VIDEO */}
        <div className="flex gap-4 justify-center">
          {/* Pause / Resume button */}
          <button
            type="button"
            onClick={isPaused ? resumeRecording : pauseRecording}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl text-lg transition-colors"
          >
            {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>

          {/* Stop button */}
          <button
            type="button"
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg transition-colors flex items-center gap-2"
          >
            <StopCircle size={20} />
            STOP
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={() => {
              stopRecording();
              resetRecording();
            }}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl text-lg transition-colors"
          >
            ✕ CANCEL
          </button>
        </div>
      </div>
    );
  }

  // If video is uploaded, show preview
  if (value) {
    return (
      <div className={className}>
        <p className="text-sm font-medium mb-1.5">{label}</p>
        <div className="relative rounded-2xl border border-border bg-background overflow-hidden">
          <video
            src={value}
            controls
            className="w-full h-auto max-h-64 object-contain bg-black"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full shadow-soft hover:bg-background"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Select mode: choose upload or record
  if (mode === "select") {
    return (
      <div className={className}>
        <p className="text-sm font-medium mb-1.5">{label}</p>
        <div className="grid grid-cols-2 gap-2">
          {/* Upload option */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="p-4 rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-colors flex flex-col items-center gap-2"
          >
            <Upload size={24} className="text-muted" />
            <span className="text-xs font-medium text-center">Upload video</span>
            <span className="text-xs text-muted text-center">Max 1 min, 50MB</span>
          </button>

          {/* Record option */}
          <button
            type="button"
            onClick={startRecording}
            className="p-4 rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-colors flex flex-col items-center gap-2"
          >
            <Mic size={24} className="text-muted" />
            <span className="text-xs font-medium text-center">Record video</span>
            <span className="text-xs text-muted text-center">Max 1 minute</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pickFile(f);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  // Preview mode (after recording stops)
  return (
    <div className={className}>
      <p className="text-sm font-medium mb-1.5">{label}</p>
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <video
          ref={videoRef}
          src={preview}
          controls
          className="w-full h-auto max-h-64 object-contain bg-black"
        />

        <div className="p-3 flex gap-2">
          <button
            type="button"
            onClick={() => onChange(preview)}
            disabled={busy}
            className="flex-1 px-3 py-2 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:bg-accent/90 disabled:opacity-50"
          >
            {busy ? "Uploading..." : "✓ Use this video"}
          </button>
          <button
            type="button"
            onClick={resetRecording}
            disabled={busy}
            className="flex-1 px-3 py-2 bg-foreground/10 text-foreground rounded-lg font-medium text-sm hover:bg-foreground/20 disabled:opacity-50"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
