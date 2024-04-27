import React from "react";

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
    <>
      {decodingResult.error ? (
        <DisplayError
          decodingError={decodingResult.error}
          resetResult={resetResult}
        />
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
