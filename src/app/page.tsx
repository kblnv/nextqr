"use client";

import { DisplayCamAccess } from "@/components/features/display-cam-access";
import { DisplayResult } from "@/components/features/display-result";
import { Button } from "@/components/shared/button";
import { textIsUrl } from "@/lib/utils";
import { DecodingResult } from "@/types/decoding-result";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Loader } from "@/components/shared/loader";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
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

  const videoContainer = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanAreaRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrame = useRef<number | null>(null);

  const testCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    videoContainer.current = document.getElementById("video-container");

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
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 shadow-sm">
        {checkingCamAccess ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col items-center gap-1">
              <DisplayCamAccess hasAccess={hasCamAccess} />

              {hasCamAccess && (
                <Button
                  className=" mt-4"
                  onClick={handleCamOn}
                  disabled={!hasCamAccess}
                >
                  Включить камеру
                </Button>
              )}
            </div>

            {createPortal(
              <>
                <div className={camOn ? "block" : "hidden"}>
                  <video
                    ref={videoRef}
                    playsInline
                    className="absolute left-0 top-0 h-full w-full object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute h-8 w-8 translate-x-5 translate-y-5"
                    onClick={handleCamOff}
                  >
                    <X />
                  </Button>
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    ref={scanAreaRef}
                  >
                    <svg width="310" height="310" viewBox="0 0 215 215">
                      <g
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          transform="translate(-146.000000, -58.000000)"
                          fill="#FFFFFF"
                          fillRule="nonzero"
                        >
                          <g transform="translate(146.000000, 58.000000)">
                            <path d="M169.272388,200.559701 L169.272388,194.141791 L169.272388,200.559701 Z M206.977612,169.272388 L213.395522,169.272388 L206.977612,169.272388 Z M197.751866,196.548507 L195.386866,194.380056 L197.751866,196.548507 Z M177.294776,215 C182.766045,215 188.646455,214.846772 193.977332,213.800653 C199.295373,212.757743 204.460187,210.752948 208.139254,206.739347 L203.409254,202.402444 C201.047463,204.977631 197.426959,206.583713 192.741884,207.503078 C188.07125,208.420037 182.731549,208.58209 177.294776,208.58209 L177.294776,215 Z M208.139254,206.739347 C211.515877,203.057071 213.159664,197.946007 214.013246,192.871045 C214.876455,187.740728 215,182.195653 215,177.294776 L208.58209,177.294776 C208.58209,182.153134 208.452127,187.240933 207.684384,191.806474 C206.907015,196.426567 205.543209,200.074347 203.409254,202.402444 L208.139254,206.739347 L208.139254,206.739347 Z M200.559701,37.7052239 L194.141791,37.7052239 L200.559701,37.7052239 Z M196.548507,9.22574627 L194.380056,11.5907463 L196.548507,9.22574627 Z M215,37.7052239 C215,32.2339552 214.846772,26.3535448 213.800653,21.0226679 C212.757743,15.7046269 210.752948,10.5398134 206.739347,6.86074627 L202.402444,11.5907463 C204.977631,13.9525373 206.583713,17.573041 207.503078,22.2581157 C208.420037,26.9295522 208.58209,32.2684515 208.58209,37.7052239 L215,37.7052239 Z M206.739347,6.86074627 C203.057071,3.48412313 197.946007,1.84033582 192.871045,0.986753731 C187.740728,0.123544776 182.195653,5.32907052e-15 177.294776,5.32907052e-15 L177.294776,6.41791045 C182.153134,6.41791045 187.240933,6.54787313 191.806474,7.31561567 C196.426567,8.09298507 200.074347,9.45759328 202.402444,11.5915485 L206.739347,6.86074627 Z M6.41791045,169.272388 L12.8358209,169.272388 L6.41791045,169.272388 Z M37.7052239,206.977612 L37.7052239,213.395522 L37.7052239,206.977612 Z M10.4291045,197.751866 L12.597556,195.386866 L10.4291045,197.751866 Z M-2.39808173e-14,177.294776 C-2.39808173e-14,182.766045 0.152425373,188.646455 1.19934701,193.977332 C2.24225746,199.295373 4.24705224,204.460187 8.26065299,208.139254 L12.597556,203.409254 C10.0223694,201.047463 8.41628731,197.426959 7.49692164,192.741884 C6.57996269,188.07125 6.41791045,182.731549 6.41791045,177.294776 L-2.39808173e-14,177.294776 Z M8.26065299,208.139254 C11.9429291,211.515877 17.0539925,213.159664 22.1289552,214.013246 C27.2600746,214.876455 32.8051493,215 37.7052239,215 L37.7052239,208.58209 C32.8468657,208.58209 27.7590672,208.452127 23.1943284,207.684384 C18.5734328,206.907015 14.925653,205.543209 12.597556,203.409254 L8.26065299,208.139254 L8.26065299,208.139254 Z M37.7052239,6.41791045 L37.7052239,12.8358209 L37.7052239,6.41791045 Z M9.22574627,10.4291045 L11.5907463,12.597556 L9.22574627,10.4291045 Z M37.7052239,0 C32.2339552,0 26.3535448,0.152425373 21.0226679,1.19934701 C15.7046269,2.24225746 10.5398134,4.24705224 6.86074627,8.26065299 L11.5907463,12.597556 C13.9525373,10.0223694 17.573041,8.41628731 22.2581157,7.49692164 C26.9295522,6.57996269 32.2684515,6.41791045 37.7052239,6.41791045 L37.7052239,0 Z M6.86074627,8.26065299 C3.48412313,11.9429291 1.84033582,17.0539925 0.986753731,22.1289552 C0.123544776,27.2600746 -1.42108547e-14,32.8051493 -1.42108547e-14,37.7052239 L6.41791045,37.7052239 C6.41791045,32.8468657 6.54787313,27.7590672 7.31561567,23.1943284 C8.09298507,18.5734328 9.45759328,14.925653 11.5915485,12.597556 L6.86074627,8.26065299 Z"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                </div>
              </>,
              videoContainer.current!,
            )}
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
