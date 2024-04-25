"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React from "react";

const UploadPage: React.FC = () => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Загрузите файл с QR-кодом</Label>
      <Input id="picture" type="file" />
    </div>
  );
};

export default UploadPage;
