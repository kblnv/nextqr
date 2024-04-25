import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface IDisplayErrorProps {
  msg: string;
}

const DisplayError: React.FC<IDisplayErrorProps> = ({ msg }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>
        Произошла ошибка в ходе считывания файла
      </AlertDescription>
    </Alert>
  );
};

export { DisplayError };
