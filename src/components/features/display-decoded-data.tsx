import { Button } from "@/components/shared/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { DecodedData } from "@/types/decoding-result";
import { Copy } from "lucide-react";
import React, { useRef } from "react";

interface DisplayDecodedDataProps {
  decodedData: DecodedData["data"];
}

const DisplayDecodedData: React.FC<DisplayDecodedDataProps> = ({
  decodedData,
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
    <>
      <DialogHeader>
        <DialogTitle>Декодированные данные</DialogTitle>
        <DialogDescription>Закройте окно чтобы продолжить</DialogDescription>
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
          <span className="sr-only">Копировать</span>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <DialogFooter className="sm:justify-start">
        <div className="flex flex-col gap-2 sm:flex-row">
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
    </>
  );
};

export { DisplayDecodedData };
