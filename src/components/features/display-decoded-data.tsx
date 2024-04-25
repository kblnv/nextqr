import React from "react";
import Link from "next/link";

import { IDecodedData } from "@/types/decoded-data";

interface IDisplayDecodedDataProps {
  decodedData: IDecodedData;
}

const DisplayDecodedData: React.FC<IDisplayDecodedDataProps> = ({
  decodedData,
}) => {
  return (
    <>
      <p className="leading-7">Декодированный текст:</p>
      {decodedData.isURL ? (
        <Link
          href={decodedData.text}
          target="_blank"
          className="text-blue-500 underline"
        >
          {decodedData.text}
        </Link>
      ) : (
        <p className="leading-7">{decodedData.text}</p>
      )}
    </>
  );
};

export { DisplayDecodedData };
