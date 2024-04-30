import React from "react";
import { Dialog, DialogContent } from "@/components/shared/dialog";
import { DecodingResult } from "@/types/decoding-result";
import { DisplayDecodedData } from "./display-decoded-data";
import { DisplayError } from "./display-error";

interface IDisplayResultProps {
  decodingResult: DecodingResult;
  onModalClose: () => void;
}

const DisplayResult: React.FC<IDisplayResultProps> = ({
  decodingResult,
  onModalClose,
}) => {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent
        className="w-11/12 sm:max-w-md"
        onCloseAutoFocus={onModalClose}
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
