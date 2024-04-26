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

const readerOptions: ReaderOptions = {
  tryHarder: true,
  formats: ["QRCode"],
};

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [decodingResult, setDecodingResult] = useState<DecodingResult | null>(
    null
  );

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
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <div className="flex gap-4">
        <Button onClick={startCamera}>Включить камеру</Button>
        <Button onClick={stopCamera}>Выключить камеру</Button>
        <Button onClick={scan}>Сканировать</Button>
      </div>

      <video ref={videoRef} autoPlay className="mt-4" />

      {decodingResult && (
        <DisplayResult
          decodingResult={decodingResult}
          resetResult={resetResult}
        />
      )}
    </div>
  );
};

export default ScanPage;
