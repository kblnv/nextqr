"use client";

import { DisplayCamAccess } from "@/components/features/display-cam-access";
import { DisplayResult } from "@/components/features/display-result";
import { Button } from "@/components/shared/button";
import { textIsUrl } from "@/lib/utils";
import { DecodingResult } from "@/types/decoding-result";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { LoaderCircle } from "lucide-react";
import {
  readBarcodesFromImageData,
  type ReaderOptions,
} from "zxing-wasm/reader";

const readerOptions: ReaderOptions = {
  tryHarder: true,
  formats: ["QRCode"],
};

const ScanPage: React.FC = () => {
  const [decodingResult, setDecodingResult] = useState<DecodingResult | null>(
    null,
  );

  const [hasCamAccess, setHasCamAccess] = useState(false);
  const [checkingCamAccess, setCheckingCamAccess] = useState(true);
  const [camOn, setCamOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
      })
      .then((stream) => {
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamAccess(true);
        }
      })
      .catch(() => {
        setHasCamAccess(false);
      })
      .finally(() => {
        setCheckingCamAccess(false);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCamOn = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setCamOn(true);
      startScanning();
    }
  };

  const handleCamOff = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setCamOn(false);
      cancelAnimationFrame(animationFrame.current!);
    }
  };

  const startScanning = useCallback(async () => {
    if (videoRef.current) {
      const context = new OffscreenCanvas(
        videoRef.current.videoWidth,
        videoRef.current.videoHeight,
      ).getContext("2d") as OffscreenCanvasRenderingContext2D;

      context.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight,
      );
      const imageData = context.getImageData(
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight,
      );

      const [processedData] = await readBarcodesFromImageData(
        imageData,
        readerOptions,
      );

      if (!processedData) {
        console.log("scanning!");
        animationFrame.current = requestAnimationFrame(startScanning);
      } else {
        console.log("finished!");
        setDecodingResult({
          data: {
            text: processedData.text,
            isURL: textIsUrl(processedData.text),
          },
        });
      }
    }
  }, []);

  const resetResult = useCallback(() => {
    setDecodingResult(null);
    startScanning();
  }, [startScanning]);

  return (
    <>
      <div
        className={
          camOn
            ? "flex flex-1 justify-center rounded-lg border border-dashed shadow-sm"
            : "flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 shadow-sm"
        }
      >
        <div className={camOn ? "hidden" : "block"}>
          {checkingCamAccess ? (
            <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
          ) : (
            <div className="flex items-center gap-2">
              <DisplayCamAccess hasAccess={hasCamAccess} />
            </div>
          )}
        </div>
        <video
          ref={videoRef}
          className={camOn ? "block h-full rounded-lg" : "hidden"}
        />
      </div>

      {camOn ? (
        <Button
          className="w-full sm:w-fit"
          variant="outline"
          onClick={handleCamOff}
        >
          Выключить камеру
        </Button>
      ) : (
        <Button
          className="w-full sm:w-fit"
          variant="outline"
          onClick={handleCamOn}
          disabled={!hasCamAccess}
        >
          Включить камеру
        </Button>
      )}

      {decodingResult && (
        <DisplayResult
          decodingResult={decodingResult}
          resetResult={resetResult}
        />
      )}
    </>
  );
};

export default ScanPage;
