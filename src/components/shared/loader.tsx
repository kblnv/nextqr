import { LoaderCircle } from "lucide-react";
import React from "react";

const Loader: React.FC = () => {
  return <LoaderCircle className="h-8 w-8 animate-spin text-blue-500" />;
};

export { Loader };
