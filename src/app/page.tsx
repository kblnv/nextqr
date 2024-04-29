"use client";

import { DisplayCamAccess } from "@/components/features/display-cam-access";
import { DisplayResult } from "@/components/features/display-result";
import { Button } from "@/components/shared/button";
import { textIsUrl } from "@/lib/utils";
import { DecodingResult } from "@/types/decoding-result";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Loader } from "@/components/shared/loader";
import { ScanArea } from "@/components/shared/scan-area";
import { X } from "lucide-react";
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
  const scanAreaRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          setHasCamAccess(true);
        }
      } catch (err) {
        setHasCamAccess(false);
      } finally {
        setCheckingCamAccess(false);
      }
    })();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCamOn = async () => {
    if (videoRef.current) {
      await videoRef.current.play();
      setCamOn(true);
      startScanning();
    }
  };

  const handleCamOff = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setCamOn(false);
      cancelAnimationFrame(animationFrameRef.current!);
    }
  };

  const startScanning = useCallback(async () => {
    if (videoRef.current && scanAreaRef.current) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      const scanAreaWidth = 310;
      const scanAreaHeight = 310;

      const scanAreaLeft = (videoWidth - scanAreaWidth) / 2;
      const scanAreaTop = (videoHeight - scanAreaHeight) / 2;

      const context = new OffscreenCanvas(videoWidth, videoHeight).getContext(
        "2d",
      ) as OffscreenCanvasRenderingContext2D;

      context.drawImage(
        videoRef.current,
        scanAreaLeft,
        scanAreaTop,
        scanAreaWidth,
        scanAreaHeight,
        0,
        0,
        scanAreaWidth,
        scanAreaHeight,
      );

      const imageData = context.getImageData(
        0,
        0,
        scanAreaWidth,
        scanAreaHeight,
      );

      const [processedData] = await readBarcodesFromImageData(
        imageData,
        readerOptions,
      );

      if (!processedData) {
        console.log("scanning!");
        animationFrameRef.current = requestAnimationFrame(startScanning);
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
      <div id="video-container" className={camOn ? "fixed left-0 top-0 h-full w-full" : "hidden"}>
        <video
          ref={videoRef}
          playsInline
          className="h-full w-full object-cover"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-0 top-0 h-8 w-8 translate-x-5 translate-y-5"
          onClick={handleCamOff}
        >
          <X />
        </Button>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          ref={scanAreaRef}
        >
          <ScanArea />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 shadow-sm">
        {checkingCamAccess ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col items-center gap-1">
              <DisplayCamAccess hasAccess={hasCamAccess} />

              {hasCamAccess && (
                <Button className="mt-4" onClick={handleCamOn}>
                  Включить камеру
                </Button>
              )}
            </div>
          </>
        )}
      </div>

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
