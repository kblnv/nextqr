import { Button } from "@/components/shared/button";
import { X } from "lucide-react";
import React from "react";

interface CameraToolbarProps {
  turnOffCamera: () => void;
}

const CameraToolbar: React.FC<CameraToolbarProps> = ({ turnOffCamera }) => {
  return (
    <div className="absolute left-0 top-0 flex h-14 w-full items-center px-4 lg:h-[60px] lg:px-6">
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10"
        onClick={turnOffCamera}
      >
        <X />
      </Button>
    </div>
  );
};

export { CameraToolbar };
