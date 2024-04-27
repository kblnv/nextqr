"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  readBarcodesFromImageData,
  type ReaderOptions,
} from "zxing-wasm/reader";

import { Button } from "@/components/shared/button";
import { DecodingResult } from "@/types/decoding-result";
import { textIsUrl } from "@/lib/utils";
import { DisplayResult } from "@/components/features/display-result";
import { Check, X } from "lucide-react";

const readerOptions: ReaderOptions = {
  tryHarder: true,
  formats: ["QRCode"],
};

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [decodingResult, setDecodingResult] = useState<DecodingResult | null>(
    null
  );
  const [hasCamAccess, setHasCamAccess] = useState(false);

  let stream: MediaStream | null = null;

  const resetResult = useCallback(() => {
    setDecodingResult(null);
  }, []);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((newStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          stream = newStream;
        }
      })
      .catch(() => {});
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      stream = null;
    }
  };

  const scan = async () => {
    const context = new OffscreenCanvas(
      videoRef.current!.videoWidth,
      videoRef.current!.videoHeight
    ).getContext("2d") as OffscreenCanvasRenderingContext2D;

    context.drawImage(
      videoRef.current!,
      0,
      0,
      videoRef.current!.videoWidth,
      videoRef.current!.videoHeight
    );
    const imageData = context.getImageData(
      0,
      0,
      videoRef.current!.videoWidth,
      videoRef.current!.videoHeight
    );
    const [processedData] = await readBarcodesFromImageData(
      imageData,
      readerOptions
    );

    if (processedData) {
      setDecodingResult({
        data: {
          text: processedData.text,
          isURL: textIsUrl(processedData.text),
        },
      });
    }
  };

  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm px-4">
        <div className="flex gap-2 items-center">
          {hasCamAccess ? (
            <>
              <X className="w-5 h-5 text-red-500" />
              <p className="text-md font-semibold sm:text-lg">
                Вы не предоставили доступ к камере
              </p>
            </>
          ) : (
            <>
              <Check className="w-5 h-5 text-green-500" />
              <p className="text-md font-semibold sm:text-lg">
                Вы предоставили доступ к камере
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-col sm:flex-row">
        <Button onClick={startCamera} variant="outline">
          Включить камеру
        </Button>
        <Button onClick={scan} variant="outline">
          Сканировать
        </Button>
        <Button
          onClick={() => setHasCamAccess(!hasCamAccess)}
          variant="outline"
        >
          Доступ
        </Button>
      </div>
    </>
  );
};

export default ScanPage;
