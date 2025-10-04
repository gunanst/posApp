"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

type BarcodeScannerProps = {
  onDetected: (code: string) => void;
  onNoCamera: () => void;
};

export default function BarcodeScanner({ onDetected, onNoCamera }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);

  // Tunggu sampai video punya dimensi valid
  const waitForVideoDimensions = (video: HTMLVideoElement): Promise<void> => {
    return new Promise((resolve) => {
      const check = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  };

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setError("Browser Anda tidak mendukung fitur kamera.");
        setHasCamera(false);
        onNoCamera();
        setLoading(false);
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (d): d is MediaDeviceInfo => d.kind === "videoinput"
        );

        if (videoInputDevices.length === 0) {
          setError("Kamera tidak ditemukan pada perangkat ini.");
          setHasCamera(false);
          onNoCamera();
          setLoading(false);
          return;
        }

        setHasCamera(true);

        if (!videoRef.current) {
          setError("Elemen video tidak tersedia.");
          setLoading(false);
          return;
        }

        const videoElement = videoRef.current;
        const deviceId = videoInputDevices[0].deviceId;

        if (videoElement.srcObject) {
          // Stream sudah aktif, hindari set ulang untuk mencegah error play()
          setLoading(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
        videoElement.srcObject = stream;

        try {
          await videoElement.play();
        } catch (playError) {
          console.warn("Gagal memutar video kamera:", playError);
          // Bisa di-handle atau diabaikan, tergantung kebutuhan
        }

        await waitForVideoDimensions(videoElement);

        if (!codeReaderRef.current) {
          setError("Scanner belum siap.");
          setLoading(false);
          return;
        }

        codeReaderRef.current.decodeFromVideoDevice(
          deviceId,
          videoElement,
          (result: Result | undefined, err: unknown) => {
            if (result) {
              onDetected(result.getText());
              setError(null);
              setLoading(false);
            }

            if (err && (err as { name?: string }).name !== "NotFoundException") {
              console.error("Error scanning barcode:", err);
              if (err instanceof Error) {
                setError(err.message);
              } else {
                setError(String(err));
              }
              setLoading(false);
            }
          }
        );

        setLoading(false);
      } catch (err: unknown) {
        console.error("Gagal mengakses kamera:", err);
        if (err instanceof Error) {
          setError(
            err.message ||
              "Gagal mengakses kamera. Pastikan browser Anda mendukung kamera dan sudah memberikan izin."
          );
        } else {
          setError(
            "Gagal mengakses kamera. Pastikan browser Anda mendukung kamera dan sudah memberikan izin."
          );
        }
        setHasCamera(false);
        onNoCamera();
        setLoading(false);
      }
    }

    startCamera();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []); // <- empty dependency supaya hanya dijalankan sekali saat mount

  // Fallback upload gambar barcode
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
    };

    img.onload = async () => {
      if (!codeReaderRef.current) {
        setError("Scanner belum siap.");
        setUploading(false);
        return;
      }

      try {
        const result = await codeReaderRef.current.decodeFromImageElement(img);
        onDetected(result.getText());
        setError(null);
      } catch (err: unknown) {
        console.error("Gagal membaca barcode dari gambar:", err);
        if (err instanceof Error) {
          setError("Gagal membaca barcode dari gambar. Pastikan gambar jelas dan barcode terlihat.");
        } else {
          setError("Gagal membaca barcode dari gambar.");
        }
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setError("Gagal membaca file gambar.");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-md overflow-hidden border border-gray-300 bg-black relative">
      {/* Loading overlay saat kamera sedang diakses */}
      {loading && hasCamera && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-center p-4">
          Mengakses kamera...
        </div>
      )}

      {/* Pesan error */}
      {!loading && error && (
        <div className="p-4 bg-red-100 text-red-700 text-center text-sm sm:text-base">
          {error}
          <br />
          <small>
            Silakan gunakan input manual atau upload gambar barcode jika kamera tidak tersedia.
          </small>
        </div>
      )}

      {/* Video kamera hanya tampil jika kamera tersedia dan tidak error */}
      <video
        ref={videoRef}
        className={`w-full h-auto ${error || !hasCamera ? "hidden" : "block"}`}
        muted
        playsInline
        autoPlay
        style={{ borderRadius: 8, objectFit: "cover", aspectRatio: "4 / 3" }}
      />

      {/* Upload fallback untuk perangkat tanpa kamera */}
      {!hasCamera && (
        <div className="p-4 bg-white rounded-md mt-2">
          <label
            htmlFor="barcode-upload"
            className="block cursor-pointer border border-dashed border-gray-400 rounded-md p-4 text-center text-gray-600 hover:bg-gray-50"
          >
            {uploading ? "Memproses gambar..." : "Upload gambar barcode"}
            <input
              id="barcode-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
