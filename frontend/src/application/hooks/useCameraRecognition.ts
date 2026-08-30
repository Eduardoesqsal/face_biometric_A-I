import { useEffect, useRef, useState } from "react";
import type { RecognitionResponse } from "../../domain/types";
import { recognizeFace } from "../../infrastructure/api/recognitionApi";

type UseCameraRecognitionOptions = {
  onRegistered?: (response: RecognitionResponse) => void | Promise<void>;
};

export function useCameraRecognition(options: UseCameraRecognitionOptions = {}) {
  const { onRegistered } = options;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const scanInFlightRef = useRef(false);
  const stoppedRef = useRef(false);
  const stopCameraRef = useRef<(nextMessage?: string) => Promise<void>>(async () => {});
  const onRegisteredRef = useRef<UseCameraRecognitionOptions["onRegistered"]>(onRegistered);

  const [isRunning, setIsRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("La cámara verificará tu rostro automáticamente.");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onRegisteredRef.current = onRegistered;
  }, [onRegistered]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    stoppedRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsRunning(true);
      setError(null);
      setMessage("Cámara activa. Buscando un rostro conocido...");
      window.setTimeout(() => void scanFrame(), 120);
      timerRef.current = window.setInterval(() => {
        void scanFrame();
      }, 450);
    } catch {
      setError("No se pudo acceder a la cámara. Revisa los permisos del navegador.");
    }
  }

  async function stopCamera(nextMessage?: string) {
    stoppedRef.current = true;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsRunning(false);
    if (nextMessage) {
      setMessage(nextMessage);
    }
  }
  stopCameraRef.current = stopCamera;

  async function scanFrame() {
    if (stoppedRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || busy || scanInFlightRef.current || video.readyState < 2) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    scanInFlightRef.current = true;
    setBusy(true);
    setError(null);
    const maxWidth = 320;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        try {
          if (!blob || stoppedRef.current) {
            return;
          }

          const response = await recognizeFace(blob);
          if (stoppedRef.current) {
            return;
          }
          setMessage(response.message);

          if (response.recognized && response.registered) {
            await onRegisteredRef.current?.(response);
            await stopCameraRef.current?.("Asistencia registrada. Cámara detenida.");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error durante el reconocimiento");
        } finally {
          scanInFlightRef.current = false;
          setBusy(false);
        }
      },
      "image/jpeg",
      0.55,
    );
  }

  function toggleCamera() {
    if (isRunning) {
      void stopCamera("La cámara está detenida.");
      return;
    }

    void startCamera();
  }

  return {
    videoRef,
    canvasRef,
    isRunning,
    busy,
    message,
    error,
    startCamera,
    stopCamera,
    toggleCamera,
  };
}
