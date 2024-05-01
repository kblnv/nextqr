import { CameraToolbar } from "@/components/features/camera-toolbar";
import { DisplayResult } from "@/components/features/display-result";
import { ScanArea } from "@/components/shared/scan-area";
import { useDecodingResult } from "@/hooks/useDecodingResult";
import { textIsUrl } from "@/lib/utils";
import { CameraService } from "@/services/camera-service";
import { CameraAccessState } from "@/types/camera";
import React, { useCallback, useEffect, useRef } from "react";

interface CameraProps {
  camOn: boolean;
  setCamOn: React.Dispatch<React.SetStateAction<boolean>>;
  setCamAccessState: React.Dispatch<React.SetStateAction<CameraAccessState>>;
}

const Camera: React.FC<CameraProps> = ({
  camOn,
  setCamOn,
  setCamAccessState,
}) => {
  const { decodingResult, setDecodingResult, resetDecodingResult } =
    useDecodingResult(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        streamRef.current = await CameraService.requestCameraAccess();
        videoRef.current!.srcObject = streamRef.current;
        setCamAccessState("ok");
      } catch (err) {
        setCamAccessState("err");
      }
    })();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setCamAccessState]);

  const startScanning = useCallback(async () => {
    const processedFrame = await CameraService.scanVideoFrame(
      videoRef.current!,
      310,
      310,
    );

    if (!processedFrame) {
      animationFrameRef.current = requestAnimationFrame(startScanning);
    } else {
      cancelAnimationFrame(animationFrameRef.current!);
      setCamOn(false);
      setDecodingResult({
        data: {
          text: processedFrame.text,
          isURL: textIsUrl(processedFrame.text),
        },
      });
    }
  }, [setCamOn, setDecodingResult]);

  useEffect(() => {
    if (camOn) {
      videoRef.current!.play();
      startScanning();
    }
  }, [camOn, startScanning]);

  const turnOffCamera = useCallback(() => {
    videoRef.current!.pause();
    cancelAnimationFrame(animationFrameRef.current!);
    setCamOn(false);
  }, [setCamOn]);

  const resetResult = useCallback(() => {
    resetDecodingResult();
  }, [resetDecodingResult]);

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
        <CameraToolbar turnOffCamera={turnOffCamera} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ScanArea />
        </div>
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

export { Camera };
