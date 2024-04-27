import React from "react";
import { Check, X } from "lucide-react";

interface IDisplayCamAccessProps {
  hasAccess: boolean;
}

const DisplayCamAccess: React.FC<IDisplayCamAccessProps> = ({ hasAccess }) => {
  return (
    <>
      {hasAccess ? (
        <>
          <Check className="w-5 h-5 text-green-500" />
          <p className="text-md font-semibold sm:text-lg">
            Вы предоставили доступ к камере
          </p>
        </>
      ) : (
        <>
          <X className="w-5 h-5 text-red-500" />
          <p className="text-md font-semibold sm:text-lg">
            Вы не предоставили доступ к камере
          </p>
        </>
      )}
    </>
  );
};

export { DisplayCamAccess };
