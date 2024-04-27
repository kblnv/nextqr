export interface IDecodedData {
  error?: never;
  data: {
    text: string;
    isURL: boolean;
  };
}

export interface IDecodingError {
  data?: never;
  error: {
    msg: string;
    type?: "fromFile" | "fromCamera";
  };
}

export type DecodingResult = IDecodedData | IDecodingError;
