"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/shared/button";
import { LoaderCircle } from "lucide-react";
import { DisplayCamAccess } from "@/components/features/display-cam-access";

const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [hasCamAccess, setHasCamAccess] = useState(false);
  const [checkingCamAccess, setCheckingCamAccess] = useState(true);
  const [camOn, setCamOn] = useState(false);

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

  const handleCamOn = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setCamOn(true);
    }
  };

  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm px-4">
        <div className={camOn ? "hidden" : "block"}>
          {checkingCamAccess ? (
            <LoaderCircle className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <div className="flex gap-2 items-center">
              <DisplayCamAccess hasAccess={hasCamAccess} />
            </div>
          )}
        </div>
        <video ref={videoRef} className={camOn ? "block" : "hidden"} />
      </div>
      <div className="flex gap-2 flex-col sm:flex-row">
        <Button
          variant="outline"
          onClick={handleCamOn}
          disabled={!hasCamAccess}
        >
          Включить камеру
        </Button>
        <Button variant="outline" disabled={!camOn}>
          Сканировать
        </Button>
      </div>
    </>
  );
};

export default ScanPage;
