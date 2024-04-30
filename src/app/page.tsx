"use client";

import React, { useState } from "react";

import { Camera } from "@/components/widgets/camera";
import { CameraAccess } from "@/components/widgets/camera-access";
import { CameraAccessState } from "@/types/camera";

const ScanPage: React.FC = () => {
  const [camOn, setCamOn] = useState(false);
  const [camAccessState, setCamAccessState] =
    useState<CameraAccessState>("pending");

  return (
    <>
      <Camera
        camOn={camOn}
        setCamOn={setCamOn}
        setCamAccessState={setCamAccessState}
      />
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 shadow-sm">
        <CameraAccess camAccessState={camAccessState} setCamOn={setCamOn} />
      </div>
    </>
  );
};

export default ScanPage;
