import { Button } from "@/components/shared/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";
import { IDecodingError } from "@/types/decoding-result";
import { AlertCircle } from "lucide-react";
import React from "react";

interface IDisplayErrorProps {
  decodingError: IDecodingError["error"];
  resetResult: () => void;
}

const DisplayError: React.FC<IDisplayErrorProps> = ({
  decodingError,
  resetResult,
}) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent
        className="w-11/12 sm:max-w-md"
        onCloseAutoFocus={resetResult}
      >
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
      </DialogContent>
    </Dialog>
  );
};

export { DisplayError };
