'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type BarcodeScannerProps = {
  onDetected: (code: string) => void;
  onNoCamera?: () => void;
};

export default function BarcodeScanner({ onDetected, onNoCamera }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let scanning = false;
    let scanInterval: ReturnType<typeof setInterval> | null = null;

    const initCamera = async () => {
      try {
        setLoading(true);

        // Gunakan kamera belakang
        const constraints: MediaStreamConstraints = {
          video: { facingMode: { ideal: "environment" } },
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        setActive(true);
        setLoading(false);

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities?.();

        // 🔦 Torch support aman untuk TypeScript
        if (capabilities && Object.prototype.hasOwnProperty.call(capabilities, "torch")) {
          try {
            // TypeScript tidak tahu bahwa "torch" valid, jadi kita pakai type inline custom
            const torchConstraint: MediaTrackConstraints & { advanced?: Array<{ torch?: boolean }> } = {
              advanced: [{ torch: torchEnabled }],
            };
            await track.applyConstraints(torchConstraint);
          } catch {
            console.warn("Torch tidak bisa diaktifkan pada perangkat ini.");
          }
        }


        // 🧠 Barcode detector
        const hasBarcodeDetector = "BarcodeDetector" in window;
        if (!hasBarcodeDetector) {
          setError("Browser tidak mendukung BarcodeDetector API");
          return;
        }

        // @ts-expect-error: BarcodeDetector belum dideklarasi global oleh TS
        const barcodeDetector = new window.BarcodeDetector({
          formats: [
            "code_128", "ean_13", "ean_8", "upc_a", "upc_e",
            "code_39", "codabar", "itf", "qr_code"
          ],
        });

        // Setup canvas untuk membaca frame video
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        scanning = true;

        scanInterval = setInterval(async () => {
          if (!video || !ctx || !scanning || video.readyState !== video.HAVE_ENOUGH_DATA) return;

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const barcodes = await barcodeDetector.detect(canvas);
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              scanning = false;
              clearInterval(scanInterval!);

              // 📳 Getar di HP
              if (navigator.vibrate) navigator.vibrate(200);

              onDetected(barcodes[0].rawValue);
            }
          } catch (err) {
            console.warn("Barcode detection error:", err);
          }
        }, 400);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
        setLoading(false);
        setActive(false);
        onNoCamera?.();
      }
    };

    initCamera();

    return () => {
      scanning = false;
      if (scanInterval) clearInterval(scanInterval);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      setActive(false);
    };
  }, [onDetected, onNoCamera, torchEnabled]);

  const toggleTorch = () => setTorchEnabled((prev) => !prev);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10">
          <Loader2 className="animate-spin h-6 w-6 mb-2" />
          <p>Mengaktifkan kamera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white text-center p-4 z-10">
          <p>{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-auto max-h-[60vh] object-cover"
        muted
        playsInline
      />

      <div className="absolute bottom-2 right-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleTorch}
          disabled={!active}
        >
          {torchEnabled ? "Matikan Flash" : "Nyalakan Flash"}
        </Button>
      </div>
    </div>
  );
}
