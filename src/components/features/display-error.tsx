import { Button } from "@/components/shared/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";
import { DecodingError } from "@/types/decoding-result";
import { AlertCircle } from "lucide-react";
import React from "react";

interface DisplayErrorProps {
  decodingError: DecodingError["error"];
}

const DisplayError: React.FC<DisplayErrorProps> = ({ decodingError }) => {
  return (
    <>
      <DialogHeader>
        <div className="flex gap-2">
          <AlertCircle className="h-4 w-4" />
          <DialogTitle>Ошибка</DialogTitle>
        </div>
      </DialogHeader>
      <DialogDescription>{decodingError.msg}</DialogDescription>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Закрыть
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export { DisplayError };
