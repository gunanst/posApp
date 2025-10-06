'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export type BarcodeScannerProps = {
  onDetected: (code: string) => void;
  onNoCamera?: () => void;
};

// Hanya berlaku di browser
declare global {
  interface BarcodeDetectionResult {
    rawValue: string;
  }

  interface BarcodeDetector {
    detect(image: CanvasImageSource): Promise<BarcodeDetectionResult[]>;
  }

  interface Window {
    BarcodeDetector?: {
      new(options?: { formats: string[] }): BarcodeDetector;
    };
  }
}

export default function BarcodeScanner({ onDetected, onNoCamera }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const streamRef = useRef<MediaStream | null>(null);

  // Fungsi untuk menerapkan konstrain kamera (autofokus + torch)
  const applyCameraConstraints = useCallback(async (track: MediaStreamTrack, torch: boolean) => {
    if (typeof window === 'undefined' || !track.getCapabilities) return;

    const caps = track.getCapabilities();
    const constraints: Record<string, any> = {};

    // Autofokus kontinu
    if (caps.focusMode?.includes('continuous')) {
      constraints.focusMode = 'continuous';
    }

    // Torch (flash)
    if (caps.torch) {
      constraints.torch = torch;
    }

    if (Object.keys(constraints).length > 0) {
      try {
        await track.applyConstraints({ advanced: [constraints] });
      } catch (err) {
        console.warn('Gagal menerapkan konstrain kamera:', err);
      }
    }
  }, []);

  // Inisialisasi kamera
  const initCamera = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      const constraints: MediaStreamConstraints = {
        video: { facingMode },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      await video.play();

      setActive(true);
      setLoading(false);

      // Terapkan konstrain awal
      const track = stream.getVideoTracks()[0];
      await applyCameraConstraints(track, torchEnabled);

      // Cek dukungan BarcodeDetector
      if (!('BarcodeDetector' in window)) {
        setError('Browser tidak mendukung pemindaian otomatis. Silakan upload gambar.');
        onNoCamera?.();
        return;
      }

      const barcodeDetector = new window.BarcodeDetector({
        formats: [
          'code_128', 'ean_13', 'ean_8', 'upc_a', 'upc_e',
          'code_39', 'codabar', 'itf', 'qr_code'
        ],
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let scanning = true;

      const scanInterval = setInterval(async () => {
        const video = videoRef.current;
        if (!video || !scanning || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const barcodes = await barcodeDetector.detect(canvas);
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            scanning = false;
            clearInterval(scanInterval);
            if (navigator.vibrate) navigator.vibrate(200); // Getar
            onDetected(barcodes[0].rawValue);
          }
        } catch (err) {
          console.warn('Error deteksi barcode:', err);
        }
      }, 400);

      // Simpan interval ke ref jika perlu clear nanti
      (window as any).__scanInterval = scanInterval;

    } catch (err) {
      console.error('Gagal mengakses kamera:', err);
      setError('Tidak dapat mengakses kamera. Izinkan akses atau gunakan upload gambar.');
      setLoading(false);
      setActive(false);
      onNoCamera?.();
    }
  }, [facingMode, torchEnabled, onDetected, onNoCamera, applyCameraConstraints]);

  // Jalankan saat mount & saat torch/facingMode berubah
  useEffect(() => {
    initCamera();

    return () => {
      // Hentikan stream & interval
      if ((window as any).__scanInterval) {
        clearInterval((window as any).__scanInterval);
        delete (window as any).__scanInterval;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setActive(false);
    };
  }, [initCamera]);

  // Toggle torch
  const toggleTorch = () => {
    setTorchEnabled((prev) => !prev);
  };

  // Ganti kamera depan/belakang
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Upload gambar
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = async () => {
        if (typeof window === 'undefined' || !('BarcodeDetector' in window)) {
          setError('Browser tidak mendukung pemindaian dari gambar.');
          return;
        }

        const barcodeDetector = new window.BarcodeDetector({
          formats: [
            'code_128', 'ean_13', 'ean_8', 'upc_a', 'upc_e',
            'code_39', 'codabar', 'itf', 'qr_code'
          ],
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        try {
          const barcodes = await barcodeDetector.detect(canvas);
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            onDetected(barcodes[0].rawValue);
          } else {
            setError('Tidak ada barcode ditemukan pada gambar.');
          }
        } catch (err) {
          console.error('Error memindai gambar:', err);
          setError('Gagal memindai barcode dari gambar.');
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10">
          <Loader2 className="animate-spin h-6 w-6 mb-2" />
          <p>Mengaktifkan kamera...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white text-center p-4 z-10">
          <p>{error}</p>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-auto max-h-[60vh] object-cover"
        muted
        playsInline
      />

      {/* Kontrol */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-2">
        <Button size="sm" variant="secondary" onClick={toggleTorch} disabled={!active}>
          {torchEnabled ? 'Matikan Flash' : 'Nyalakan Flash'}
        </Button>
        <Button size="sm" variant="secondary" onClick={switchCamera} disabled={!active}>
          Ganti Kamera
        </Button>
        <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Upload Gambar
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}