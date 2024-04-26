"use client";

import React, { useRef, useState } from "react";
import {
  readBarcodesFromImageData,
  type ReaderOptions,
} from "zxing-wasm/reader";

import { Button } from "@/components/shared/button";
import { IDecodedData } from "@/types/decoded-data";
import { textIsUrl } from "@/lib/utils";
import { DisplayDecodedData } from "@/components/features/display-decoded-data";
import { DisplayError } from "@/components/features/display-error";

const readerOptions: ReaderOptions = {
  tryHarder: true,
  formats: ["QRCode"],
};

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [decodedData, setDecodedData] = useState<IDecodedData | null>(null);
  const [errorOccured, setErrorOcurred] = useState(false);

  let stream: MediaStream | null = null;

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((newStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          stream = newStream;
        }
      })
      .catch(() => {
        setErrorOcurred(true);
      });
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
      setDecodedData({
        text: processedData.text,
        isURL: textIsUrl(processedData.text),
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

      {errorOccured && (
        <DisplayError msg="Произошла ошибка при попытке запуска камеры" />
      )}

      {decodedData && <DisplayDecodedData decodedData={decodedData} />}
    </div>
  );
};

export default ScanPage;
