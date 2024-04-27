"use client";

import React, { useCallback, useRef, useState } from "react";

import { readBarcodesFromImageFile } from "zxing-wasm";

import { DisplayResult } from "@/components/features/display-result";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { textIsUrl } from "@/lib/utils";
import { DecodingResult } from "@/types/decoding-result";

const UploadPage: React.FC = () => {
  const [decodingResult, setDecodingResult] = useState<DecodingResult | null>(
    null,
  );
  const [dragged, setDragged] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetResult = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setDecodingResult(null);
    }
  }, []);

  const uploadAndProcessFile = async (fileList: FileList | null) => {
    setDecodingResult(null);

    try {
      if (fileList) {
        const [file] = fileList;
        const [processedFile] = await readBarcodesFromImageFile(file);

        setDecodingResult({
          data: {
            text: processedFile.text,
            isURL: textIsUrl(processedFile.text),
          },
        });
      }
    } catch (err) {
      setDecodingResult({
        error: {
          msg: "Произошла ошибка в ходе считывания файла: неправильный тип файла или QR-код не распознан",
        },
      });
    }
  };

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const fileList = event.target.files;
    uploadAndProcessFile(fileList);
  };

  const handleDragOn: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragged(true);
  };

  const handleDragOff: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragged(false);
  };

  const handleDrop: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragged(false);
    uploadAndProcessFile(event.dataTransfer.files);
  };

  return (
    <div
      className={
        dragged
          ? "flex flex-1 items-center justify-center rounded-lg border border-dashed border-blue-500 px-4 shadow-sm"
          : "flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 shadow-sm"
      }
      x-chunk="dashboard-02-chunk-1"
      onDragOver={handleDragOn}
      onDragEnter={handleDragOn}
      onDragLeave={handleDragOff}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Загрузите файл с QR-кодом
        </h3>
        <p className="text-sm text-muted-foreground">
          Выберите файл или перетащите его в эту область
        </p>
        <Label htmlFor="picture" className="sr-only">
          Выберите файл для загрузки
        </Label>
        <Input
          ref={inputRef}
          id="picture"
          type="file"
          onChange={handleFileUpload}
          accept=".png, .jpg, .jpeg"
          className="mt-4"
        />

        {decodingResult && (
          <DisplayResult
            decodingResult={decodingResult}
            resetResult={resetResult}
          />
        )}
      </div>
    </div>
  );
};

export default UploadPage;
