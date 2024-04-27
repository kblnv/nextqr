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

  useEffect(() => {
    let newStream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
      })
      .then((stream) => {
        newStream = stream;

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
      if (newStream) {
        newStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const resetResult = useCallback(() => {
    setDecodingResult(null);
  }, []);

  const handleCamOn = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setCamOn(true);
    }
  };

  const handleCamScan = async () => {
    const context = new OffscreenCanvas(
      videoRef.current!.videoWidth,
      videoRef.current!.videoHeight,
    ).getContext("2d") as OffscreenCanvasRenderingContext2D;

    context.drawImage(
      videoRef.current!,
      0,
      0,
      videoRef.current!.videoWidth,
      videoRef.current!.videoHeight,
    );
    const imageData = context.getImageData(
      0,
      0,
      videoRef.current!.videoWidth,
      videoRef.current!.videoHeight,
    );

    try {
      const [processedData] = await readBarcodesFromImageData(
        imageData,
        readerOptions,
      );
      setDecodingResult({
        data: {
          text: processedData.text,
          isURL: textIsUrl(processedData.text),
        },
      });
    } catch (err) {
      setDecodingResult({
        error: {
          msg: "Произошла ошибка в ходе считывания данных: QR-код не распознан",
        },
      });
    }
  };

  return (
    <>
      <div
        className={
          camOn
            ? "flex flex-1 justify-center rounded-lg border border-dashed p-4 shadow-sm"
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
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={handleCamOn}
          disabled={!hasCamAccess}
        >
          Включить камеру
        </Button>
        <Button variant="outline" disabled={!camOn} onClick={handleCamScan}>
          Сканировать
        </Button>
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
