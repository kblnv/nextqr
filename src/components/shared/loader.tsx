import { LoaderCircle } from "lucide-react";
import React from "react";

interface LoaderProps {
  msg?: string;
}

const Loader: React.FC<LoaderProps> = ({ msg }) => {
  if (msg) {
    return (
      <div className="flex flex-col items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-muted-foreground">{msg}</p>
      </div>
    );
  }

  return <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />;
};

export { Loader };
