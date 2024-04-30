"use client";

import { DisplayCamAccess } from "@/components/features/display-cam-access";
import { DisplayResult } from "@/components/features/display-result";
import { Button } from "@/components/shared/button";
import { DecodingResult } from "@/types/decoding-result";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Loader } from "@/components/shared/loader";
import { ScanArea } from "@/components/shared/scan-area";
import { textIsUrl } from "@/lib/utils";
import { CameraService } from "@/services/camera-service";
import { X } from "lucide-react";

const ScanPage: React.FC = () => {
  const [decodingResult, setDecodingResult] = useState<DecodingResult | null>(
    null,
  );

  const [hasCamAccess, setHasCamAccess] = useState(false);
  const [checkingCamAccess, setCheckingCamAccess] = useState(true);
  const [camOn, setCamOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        streamRef.current = await CameraService.requestCameraAccess();
        videoRef.current!.srcObject = streamRef.current;
        setHasCamAccess(true);
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
    await videoRef.current!.play();
    setCamOn(true);
    startScanning();
  };

  const handleCamOff = () => {
    videoRef.current!.pause();
    setCamOn(false);
    setDecodingResult(null);
    cancelAnimationFrame(animationFrameRef.current!);
  };

  const startScanning = useCallback(async () => {
    const processedFrame = await CameraService.scanVideoFrame(
      videoRef.current!,
      310,
      310,
    );

    if (!processedFrame) {
      console.log("scanning!");
      animationFrameRef.current = requestAnimationFrame(startScanning);
    } else {
      console.log("finished!");
      cancelAnimationFrame(animationFrameRef.current!);
      setCamOn(false);
      setDecodingResult({
        data: {
          text: processedFrame.text,
          isURL: textIsUrl(processedFrame.text),
        },
      });
    }
  }, []);

  const resetResult = useCallback(() => {
    setDecodingResult(null);
  }, []);

  return (
    <>
      <div
        id="video-container"
        className={camOn ? "fixed left-0 top-0 h-full w-full" : "hidden"}
      >
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
          onModalClose={resetResult}
        />
      )}
    </>
  );
};

export default ScanPage;
