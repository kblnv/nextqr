"use client";

import React, { useState } from "react";

import { readBarcodesFromImageFile } from "zxing-wasm";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisplayDecodedData } from "@/components/features/display-decoded-data";
import { DisplayError } from "@/components/features/display-error";
import { IDecodedData } from "@/types/decoded-data";
import { textIsUrl } from "@/lib/utils";

const UploadPage: React.FC = () => {
  const [decodedData, setDecodedData] = useState<IDecodedData | null>(null);
  const [errorOccured, setErrorOcurred] = useState(false);

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    setDecodedData(null);
    setErrorOcurred(false);

    const fileList = event.target.files;

    try {
      if (fileList) {
        const [file] = fileList;
        const [processedFile] = await readBarcodesFromImageFile(file);

        setDecodedData({
          text: processedFile.text,
          isURL: textIsUrl(processedFile.text),
        });
      }
    } catch (err) {
      setErrorOcurred(true);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Загрузите файл с QR-кодом</Label>
      <Input
        id="picture"
        type="file"
        onChange={handleFileUpload}
        accept=".png, .jpg, .jpeg"
      />

      {errorOccured && (
        <DisplayError msg="Произошла ошибка в ходе считывания файла" />
      )}

      {decodedData && <DisplayDecodedData decodedData={decodedData} />}
    </div>
  );
};

export default UploadPage;
