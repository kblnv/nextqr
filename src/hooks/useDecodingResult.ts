import { DecodingResult } from "@/types/decoding-result";
import { useCallback, useState } from "react";

export function useDecodingResult(initialValue: DecodingResult | null) {
  const [decodingResult, setDecodingResult] = useState<DecodingResult | null>(
    initialValue,
  );

  return {
    decodingResult,
    setDecodingResult,
    resetDecodingResult: useCallback(
      () => setDecodingResult(initialValue),
      [initialValue],
    ),
  };
}
