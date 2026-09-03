import { useState, useRef, useCallback } from 'react';
import { useTranslation } from '@/lib/useTranslation';

interface UseMediaRecorderOptions {
  maxDurationSeconds: number;
  maxBytes: number;
}

interface MediaRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  preview: string | null;
  error: string | null;
  duration: number;
}

export function useMediaRecorder(options: UseMediaRecorderOptions) {
  const t = useTranslation();
  const [state, setState] = useState<MediaRecorderState>({
    isRecording: false,
    isPaused: false,
    preview: null,
    error: null,
    duration: 0,
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support
  const isSupported = useCallback(() => {
    if (!window.isSecureContext) {
      setState(prev => ({ ...prev, error: 'Secure context required (HTTPS)' }));
      return false;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setState(prev => ({ ...prev, error: 'Camera not supported in this browser' }));
      return false;
    }

    return true;
  }, []);

  const start = useCallback(async () => {
    if (!isSupported()) return;

    try {
      setState(prev => ({ ...prev, error: null }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4',
      });

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorderRef.current = recorder;
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
      }));

      // Start duration timer
      let elapsedSeconds = 0;
      durationIntervalRef.current = setInterval(() => {
        elapsedSeconds++;
        setState(prev => ({ ...prev, duration: elapsedSeconds }));

        if (elapsedSeconds >= options.maxDurationSeconds) {
          stop();
        }
      }, 1000);

      recorder.start();

      // Attach stream to preview video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      let errorMsg = 'Failed to access camera';

      if (err.name === 'NotAllowedError') {
        errorMsg = t('common.error_camera_permission_denied') || 'Camera permission denied';
      } else if (err.name === 'NotFoundError') {
        errorMsg = t('common.error_camera_not_found') || 'No camera device found';
      }

      setState(prev => ({ ...prev, error: errorMsg, isRecording: false }));
    }
  }, [isSupported, options.maxDurationSeconds, t]);

  const pause = useCallback(() => {
    if (recorderRef.current && state.isRecording && !state.isPaused) {
      recorderRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    }
  }, [state.isRecording, state.isPaused]);

  const resume = useCallback(() => {
    if (recorderRef.current && state.isRecording && state.isPaused) {
      recorderRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));

      let elapsedSeconds = state.duration;
      durationIntervalRef.current = setInterval(() => {
        elapsedSeconds++;
        setState(prev => ({ ...prev, duration: elapsedSeconds }));

        if (elapsedSeconds >= options.maxDurationSeconds) {
          stop();
        }
      }, 1000);
    }
  }, [state.isRecording, state.isPaused, state.duration, options.maxDurationSeconds]);

  const stop = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!recorderRef.current || !state.isRecording) {
        resolve(null);
        return;
      }

      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);

      recorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorderRef.current?.mimeType || 'video/webm',
        });

        // Check blob size
        if (blob.size > options.maxBytes) {
          setState(prev => ({
            ...prev,
            error: `Video too large (max ${(options.maxBytes / 1024 / 1024).toFixed(0)}MB)`,
            isRecording: false,
          }));
          resolve(null);
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(blob);
        setState(prev => ({
          ...prev,
          isRecording: false,
          isPaused: false,
          preview: previewUrl,
        }));

        resolve(blob);
      };

      recorderRef.current.stop();

      // Stop stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    });
  }, [state.isRecording, options.maxBytes]);

  const discard = useCallback(() => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }

    setState(prev => ({
      ...prev,
      preview: null,
      error: null,
      duration: 0,
    }));

    chunksRef.current = [];
  }, [state.preview]);

  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }
  }, [state.preview]);

  return {
    state,
    videoRef,
    start,
    pause,
    resume,
    stop,
    discard,
    cleanup,
  };
}
