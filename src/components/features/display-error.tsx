import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/alert";
import { IDecodingError } from "@/types/decoding-result";

interface IDisplayErrorProps {
  decodingError: IDecodingError['error'];
}

const DisplayError: React.FC<IDisplayErrorProps> = ({ decodingError }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>{decodingError.msg}</AlertDescription>
    </Alert>
  );
};

export { DisplayError };
