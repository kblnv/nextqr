import React, { useRef } from "react";

import { Copy } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";
import { Label } from "@/components/shared/label";
import { Input } from "@/components/shared/input";
import { Button } from "@/components/shared/button";
import { IDecodedData } from "@/types/decoding-result";

interface IDisplayDecodedDataProps {
  decodedData: IDecodedData["data"];
  resetResult: () => void;
}

const DisplayDecodedData: React.FC<IDisplayDecodedDataProps> = ({
  decodedData,
  resetResult,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openLink = () => {
    window.open(decodedData.text, "_blank");
  };

  const copyText = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <Dialog defaultOpen={true}>
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={resetResult}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Декодированные данные</DialogTitle>
          <DialogDescription>
            Все Ваши сканирования сохраняются в истории
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Ссылка
            </Label>
            <Input
              ref={inputRef}
              id="link"
              defaultValue={decodedData.text}
              className={decodedData.isURL ? "text-blue-500 underline" : ""}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={copyText}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex sm:flex-row flex-col gap-2">
            {decodedData.isURL && (
              <Button type="button" onClick={openLink}>
                Открыть
              </Button>
            )}
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Закрыть
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DisplayDecodedData };
