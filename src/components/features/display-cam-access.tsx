import { Check, X } from "lucide-react";
import React from "react";

interface IDisplayCamAccessProps {
  hasAccess: boolean;
}

const DisplayCamAccess: React.FC<IDisplayCamAccessProps> = ({ hasAccess }) => {
  return (
    <>
      {hasAccess ? (
        <>
          <Check className="h-5 w-5 text-green-500" />
          <p className="text-md font-semibold sm:text-lg">
            Вы предоставили доступ к камере
          </p>
        </>
      ) : (
        <>
          <X className="h-5 w-5 text-red-500" />
          <p className="text-md font-semibold sm:text-lg">
            Вы не предоставили доступ к камере
          </p>
        </>
      )}
    </>
  );
};

export { DisplayCamAccess };
