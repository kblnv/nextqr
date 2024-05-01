"use client";

import React, { useCallback, useRef, useState } from "react";

import { readBarcodesFromImageFile } from "zxing-wasm/reader";

import { DisplayResult } from "@/components/features/display-result";
import { FileUploadArea } from "@/components/features/file-upload-area";
import { Input } from "@/components/shared/input";
import { Label } from "@/components/shared/label";
import { Loader } from "@/components/shared/loader";
import { useDecodingResult } from "@/hooks/useDecodingResult";
import { textIsUrl } from "@/lib/utils";

const UploadPage: React.FC = () => {
  const { decodingResult, setDecodingResult, resetDecodingResult } =
    useDecodingResult(null);
  const [fileProcessing, setFileProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetResult = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      resetDecodingResult();
    }
  }, [resetDecodingResult]);

  const processFile = useCallback(
    async (fileList: FileList | null) => {
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
    },
    [resetDecodingResult, setDecodingResult],
  );

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const fileList = event.target.files;
    processFile(fileList);
  };

  return (
    <FileUploadArea processFile={processFile}>
      <div className="flex flex-col items-center gap-1">
        {fileProcessing ? (
          <Loader msg="Обрабатываем файл..." />
        ) : (
          <>
            <h1 className="text-center text-lg font-bold tracking-tight sm:text-2xl">
              Загрузите файл с QR-кодом
            </h1>
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
    </FileUploadArea>
  );
};

export default UploadPage;
