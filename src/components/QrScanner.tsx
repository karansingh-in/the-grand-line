import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import jsQR from "jsqr";
import { parseScannedTarget, isScannablePath } from "@/lib/qr";

// Full-screen camera overlay. Decodes QR frames with jsQR (pure JS, works on
// all modern phones) and routes same-origin game links inside the SPA so game
// state is preserved — no app switching needed.
export function QrScanner({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const doneRef = useRef(false);
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [rejected, setRejected] = useState<string | null>(null);

  useEffect(() => {
    doneRef.current = false;
    let raf = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    const stop = () => {
      if (timer) clearInterval(timer);
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };

    const open = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("This device or browser cannot open the camera.");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (doneRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        timer = setInterval(scan, 400);
      } catch {
        setError("Camera blocked. Allow camera access and try again — or scan with your camera app instead.");
      }
    };

    const scan = () => {
      if (doneRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h);
      const found = jsQR(data.data, w, h);
      if (!found?.data) return;
      doneRef.current = true;
      stop();
      const target = parseScannedTarget(found.data, window.location.origin);
      if (target && isScannablePath(target.path)) {
        nav({ to: target.path, search: target.search });
        onClose();
      } else {
        setRejected("That QR is not part of this hunt.");
        doneRef.current = false;
        open();
      }
    };

    open();
    return () => {
      doneRef.current = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    doneRef.current = true;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink/95">
      <div className="flex items-center justify-between px-5 py-4">
        <p className="font-display text-sm tracking-[0.3em] text-parchment">SCAN THE MARK</p>
        <button
          onClick={close}
          className="border border-parchment/40 px-4 py-2 font-display text-xs uppercase text-parchment"
        >
          Close
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-56 w-56 border-2 border-primary" />
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <p className="px-6 py-5 text-center text-sm text-parchment/70">
        {error ?? rejected ?? "Point the camera at a hunt QR code."}
      </p>
    </div>
  );
}
