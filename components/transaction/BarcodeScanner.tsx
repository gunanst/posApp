"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, CameraOff } from "lucide-react";

export type BarcodeScannerProps = {
  onDetected: (code: string) => void;
  onNoCamera?: () => void;
};

export default function BarcodeScanner({ onDetected, onNoCamera }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let scanning = false;
    let scanInterval: ReturnType<typeof setInterval> | null = null;

    const initCamera = async () => {
      try {
        setLoading(true);
        const constraints: MediaStreamConstraints = {
          video: { facingMode: useFrontCamera ? "user" : "environment" },
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

        // Torch / flash
        if (capabilities && "torch" in capabilities) {
          await track.applyConstraints({ advanced: [{ torch: torchEnabled }] });
        }

        // // Auto focus (if supported)
        // if (capabilities && "focusMode" in capabilities) {
        //   await track.applyConstraints({ advanced: [{ focusMode: "continuous" as const }] });
        // }

        // BarcodeDetector support
        if (!("BarcodeDetector" in window)) {
          setError("Browser tidak mendukung BarcodeDetector API");
          return;
        }

        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: [
            "code_128", "ean_13", "ean_8", "upc_a", "upc_e",
            "code_39", "codabar", "itf", "qr_code"
          ],
        });

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

              if (navigator.vibrate) navigator.vibrate(200);
              onDetected(barcodes[0].rawValue);
            }
          } catch (err) {
            console.warn("Barcode detection error:", err);
          }
        }, 400);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Tidak dapat mengakses kamera. Gunakan upload gambar.");
        setLoading(false);
        setActive(false);
        onNoCamera?.();
      }
    };

    initCamera();

    return () => {
      scanning = false;
      if (scanInterval) clearInterval(scanInterval);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      setActive(false);
    };
  }, [onDetected, onNoCamera, torchEnabled, useFrontCamera]);

  const toggleTorch = () => setTorchEnabled(prev => !prev);
  const switchCamera = () => setUseFrontCamera(prev => !prev);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: [
            "code_128", "ean_13", "ean_8", "upc_a", "upc_e",
            "code_39", "codabar", "itf", "qr_code"
          ],
        });

        const barcodes = await barcodeDetector.detect(canvas);
        if (barcodes.length > 0 && barcodes[0].rawValue) {
          if (navigator.vibrate) navigator.vibrate(200);
          onDetected(barcodes[0].rawValue);
        } else {
          alert("Barcode tidak terdeteksi pada gambar");
        }
      } catch (err) {
        console.error(err);
        alert("Error membaca barcode");
      }
    };
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-gray-300">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10">
          <Loader2 className="animate-spin h-6 w-6 mb-2" />
          <p>Mengaktifkan kamera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-600/80 text-white text-center p-4 z-10 gap-2">
          <p>{error}</p>
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload Gambar Barcode
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-auto max-h-[60vh] object-cover"
        muted
        playsInline
      />

      <div className="absolute bottom-2 left-2 flex gap-2">
        <Button size="sm" variant="secondary" onClick={switchCamera} disabled={!active}>
          {useFrontCamera ? <CameraOff /> : <Camera />}
          {useFrontCamera ? "Depan" : "Belakang"}
        </Button>
        <Button size="sm" variant="secondary" onClick={toggleTorch} disabled={!active}>
          {torchEnabled ? "Matikan Flash" : "Nyalakan Flash"}
        </Button>
      </div>
    </div>
  );
}
