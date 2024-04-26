import React from "react";

import { DisplayDecodedData } from "./display-decoded-data";
import { DisplayError } from "./display-error";
import { DecodingResult } from "@/types/decoding-result";

interface IDisplayResultProps {
  decodingResult: DecodingResult;
  resetResult: () => void;
}

const DisplayResult: React.FC<IDisplayResultProps> = ({
  decodingResult,
  resetResult,
}) => {
  return (
    <>
      {decodingResult.error ? (
        <DisplayError decodingError={decodingResult.error} />
      ) : (
        <DisplayDecodedData
          decodedData={decodingResult.data}
          resetResult={resetResult}
        />
      )}
    </>
  );
};

export { DisplayResult };
