"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  readBarcodesFromImageData,
  type ReaderOptions,
} from "zxing-wasm/reader";
import { DecodingResult } from "@/types/decoding-result";
import { textIsUrl } from "@/lib/utils";
import { DisplayResult } from "@/components/features/display-result";
import { Button } from "@/components/shared/button";
import { LoaderCircle } from "lucide-react";
import { DisplayCamAccess } from "@/components/features/display-cam-access";

const readerOptions: ReaderOptions = {
  tryHarder: true,
  formats: ["QRCode"],
};

const ScanPage: React.FC = () => {
  const [decodingResult, setDecodingResult] = useState<DecodingResult | null>(
    null
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

    try {
      const [processedData] = await readBarcodesFromImageData(
        imageData,
        readerOptions
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
            ? "flex flex-1 justify-center rounded-lg border border-dashed shadow-sm p-4"
            : "flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4"
        }
      >
        <div className={camOn ? "hidden" : "block"}>
          {checkingCamAccess ? (
            <LoaderCircle className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <div className="flex gap-2 items-center">
              <DisplayCamAccess hasAccess={hasCamAccess} />
            </div>
          )}
        </div>
        <video
          ref={videoRef}
          className={camOn ? "block rounded-lg h-full" : "hidden"}
        />
      </div>
      <div className="flex gap-2 flex-col sm:flex-row">
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
