"use client";

import { useEffect, useState } from "react";
import { useMediaRecorder } from "@/lib/hooks/useMediaRecorder";
import { useTranslation } from "@/lib/useTranslation";
import { Button } from "@/components/ui/Button";
import { Pause, Play, X, CheckCircle2, RotateCcw } from "lucide-react";

interface VideoRecorderProps {
  maxDurationSeconds: number;
  maxBytes: number;
  variant?: "inline" | "fullscreen";
  onConfirm: (blob: Blob, preview: string) => void;
  onCancel: () => void;
}

export function VideoRecorder({
  maxDurationSeconds,
  maxBytes,
  variant = "inline",
  onConfirm,
  onCancel,
}: VideoRecorderProps) {
  const t = useTranslation();
  const [stage, setStage] = useState<"idle" | "recording" | "preview">("idle");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const { state, videoRef, start, pause, resume, stop, discard, cleanup } =
    useMediaRecorder({
      maxDurationSeconds,
      maxBytes,
    });

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handleStart = async () => {
    setStage("recording");
    await start();
  };

  const handleStop = async () => {
    const blob = await stop();
    if (blob) {
      setRecordedBlob(blob);
      setStage("preview");
    }
  };

  const handleConfirm = () => {
    if (recordedBlob && state.preview) {
      onConfirm(recordedBlob, state.preview);
    }
  };

  const handleRetake = () => {
    discard();
    setRecordedBlob(null);
    setStage("idle");
  };

  const handleCancel = () => {
    cleanup();
    discard();
    setRecordedBlob(null);
    setStage("idle");
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col md:items-center md:justify-center">
        {/* Header - Mobile only */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Record Video</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main area */}
        <div className="flex-1 md:flex-none flex items-center justify-center bg-black w-full">
          {stage === "recording" && (
            <div className="relative w-full h-full md:h-auto md:max-w-[600px] md:aspect-video flex flex-col md:rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Close button - Desktop */}
              <button
                onClick={handleCancel}
                className="hidden md:block absolute top-2 right-2 bg-slate-900/80 text-gray-400 hover:text-white p-2 rounded-full"
              >
                <X size={24} />
              </button>

              {/* Timer overlay */}
              <div className="absolute top-4 md:top-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full font-mono text-lg md:text-base font-bold">
                {formatTime(state.duration)}
              </div>

              {/* Controls */}
              <div className="absolute bottom-8 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                {!state.isPaused ? (
                  <Button
                    onClick={() => pause()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-sm md:text-xs"
                  >
                    <Pause size={20} className="mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={() => resume()}
                    className="bg-blue-600 hover:bg-blue-700 text-sm md:text-xs"
                  >
                    <Play size={20} className="mr-2" />
                    Resume
                  </Button>
                )}
                <Button
                  onClick={handleStop}
                  className="bg-green-600 hover:bg-green-700 text-sm md:text-xs"
                >
                  Stop
                </Button>
              </div>
            </div>
          )}

          {stage === "preview" && state.preview && (
            <div className="w-full h-full md:h-auto md:max-w-[600px] flex flex-col items-center justify-center gap-4 p-4 md:p-0 md:rounded-lg overflow-hidden bg-black">
              <video
                src={state.preview}
                controls
                className="w-full h-auto md:max-w-[600px] md:aspect-video bg-black"
              />

              <div className="flex gap-4 flex-wrap justify-center">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="text-white border-white hover:bg-slate-800 text-sm md:text-xs"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-green-600 hover:bg-green-700 text-sm md:text-xs"
                >
                  <CheckCircle2 size={20} className="mr-2" />
                  Use This Video
                </Button>
              </div>
            </div>
          )}

          {stage === "idle" && (
            <Button
              onClick={handleStart}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-lg"
            >
              <span className="w-4 h-4 bg-white rounded-full inline-block mr-2" />
              Start Recording
            </Button>
          )}
        </div>

        {/* Error message */}
        {state.error && (
          <div className="bg-red-900 text-white p-4 text-sm">{state.error}</div>
        )}
      </div>
    );
  }

  // Inline variant
  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 w-full md:max-w-[600px]">
      {stage === "idle" && (
        <Button onClick={handleStart} variant="outline" className="w-full">
          Start Recording
        </Button>
      )}

      {stage === "recording" && (
        <div className="space-y-4">
          <div className="w-full aspect-video md:max-w-[600px] rounded overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-red-600 font-bold">
              {formatTime(state.duration)}
            </span>
            <div className="flex gap-2">
              {!state.isPaused ? (
                <Button size="sm" onClick={() => pause()}>
                  <Pause size={16} />
                </Button>
              ) : (
                <Button size="sm" onClick={() => resume()}>
                  <Play size={16} />
                </Button>
              )}
              <Button size="sm" onClick={handleStop} className="bg-green-600">
                Stop
              </Button>
            </div>
          </div>
        </div>
      )}

      {stage === "preview" && state.preview && (
        <div className="space-y-4">
          <div className="w-full aspect-video md:max-w-[600px] rounded overflow-hidden bg-black">
            <video
              src={state.preview}
              controls
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetake}
              className="flex-1"
            >
              <RotateCcw size={16} className="mr-2" />
              Retake
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              className="flex-1 bg-green-600"
            >
              <CheckCircle2 size={16} className="mr-2" />
              Use
            </Button>
          </div>
        </div>
      )}

      {state.error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {state.error}
        </div>
      )}
    </div>
  );
}
