export interface DecodedData {
  error?: never;
  data: {
    text: string;
    isURL: boolean;
  };
}

export interface DecodingError {
  data?: never;
  error: {
    msg: string;
    type?: "fromFile" | "fromCamera";
  };
}

export type DecodingResult = DecodedData | DecodingError;
