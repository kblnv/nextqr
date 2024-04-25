"use client";

import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import {
  readBarcodesFromImageData,
  type ReaderOptions,
} from "zxing-wasm/reader";

const readerOptions: ReaderOptions = {
  tryHarder: true,
};

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [decodedText, setDecodedText] = useState("");

  let stream: MediaStream | null = null;

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((newStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          stream = newStream;
        }
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
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
    const decodedData = await readBarcodesFromImageData(
      imageData,
      readerOptions
    );

    console.log(imageData);
    console.log(decodedData);

    if (decodedData.length > 0) {
      setDecodedText(decodedData[0].text);
    }
  };

  return (
    <div>
      <div className="flex gap-4">
        <Button onClick={startCamera}>Включить камеру</Button>
        <Button onClick={stopCamera}>Выключить камеру</Button>
        <Button onClick={scan}>Сканировать</Button>
      </div>

      <video ref={videoRef} autoPlay className="mt-4" />

      {decodedText.length > 0 && <p>{decodedText}</p>}
    </div>
  );
};

export default ScanPage;
