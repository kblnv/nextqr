import { Button } from "@/components/shared/button";
import { Loader } from "@/components/shared/loader";
import { CameraAccessState } from "@/types/camera";
import React from "react";

interface CameraAccessProps {
  camAccessState: CameraAccessState;
  setCamOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const DisplayCameraAccess: React.FC<CameraAccessProps> = ({
  camAccessState,
  setCamOn,
}) => {
  return (
    <>
      {camAccessState === "pending" ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center gap-1">
          {camAccessState === "ok" ? (
            <>
              <h1 className="text-center text-lg font-bold tracking-tight sm:text-2xl">
                Вы предоставили доступ к камере
              </h1>
              <p className="text-center text-sm text-muted-foreground">
                Чтобы начать сканирование включите камеру
              </p>
              <Button className="mt-4" onClick={() => setCamOn(true)}>
                Включить камеру
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-center text-lg font-bold tracking-tight sm:text-2xl">
                Вы не предоставили доступ к камере
              </h1>
              <p className="text-center text-sm text-muted-foreground">
                Чтобы продолжить предоставьте доступ к камере и обновите
                страницу
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
};

export { DisplayCameraAccess };
