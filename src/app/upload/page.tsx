"use client";

import React, { useCallback, useRef, useState } from "react";

import { readBarcodesFromImageFile } from "zxing-wasm/reader";

import { DisplayResult } from "@/components/features/display-result";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { Loader } from "@/components/shared/loader";
import { textIsUrl } from "@/lib/utils";
import { useDecodingResult } from "../hooks/useDecodingResult";

const UploadPage: React.FC = () => {
  const { decodingResult, setDecodingResult, resetDecodingResult } =
    useDecodingResult(null);

  const [dragging, setDragging] = useState(false);
  const [fileProcessing, setFileProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetResult = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      resetDecodingResult();
    }
  }, [resetDecodingResult]);

  const uploadAndProcessFile = async (fileList: FileList | null) => {
    setFileProcessing(true);
    resetDecodingResult();

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
    } finally {
      setFileProcessing(false);
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
    setDragging(true);
  };

  const handleDragOff: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop: React.DragEventHandler = (event) => {
    event.preventDefault();
    setDragging(false);
    uploadAndProcessFile(event.dataTransfer.files);
  };

  return (
    <div
      className={
        dragging
          ? "flex flex-1 items-center justify-center rounded-lg border border-dashed border-blue-500 px-4 shadow-sm"
          : "flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 shadow-sm"
      }
      onDragOver={handleDragOn}
      onDragEnter={handleDragOn}
      onDragLeave={handleDragOff}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-1">
        {fileProcessing ? (
          <Loader />
        ) : (
          <>
            <h3 className="text-center text-lg font-bold tracking-tight sm:text-2xl">
              Загрузите файл с QR-кодом
            </h3>
            <p className="text-center text-sm text-muted-foreground">
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
                onModalClose={resetResult}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
