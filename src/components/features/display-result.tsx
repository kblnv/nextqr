import React from "react";

import { Dialog, DialogContent } from "@/components/shared/dialog";
import { DecodingResult } from "@/types/decoding-result";
import { DisplayDecodedData } from "./display-decoded-data";
import { DisplayError } from "./display-error";

interface IDisplayResultProps {
  decodingResult: DecodingResult;
  resetResult: () => void;
}

const DisplayResult: React.FC<IDisplayResultProps> = ({
  decodingResult,
  resetResult,
}) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent
        className="w-11/12 sm:max-w-md"
        onCloseAutoFocus={resetResult}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <>
          {decodingResult.error ? (
            <DisplayError decodingError={decodingResult.error} />
          ) : (
            <DisplayDecodedData decodedData={decodingResult.data} />
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export { DisplayResult };
