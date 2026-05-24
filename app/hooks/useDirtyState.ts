"use client";

import { useState, useMemo, useCallback } from "react";

export function useDirtyState<T>(
  data: T
): {
  isDirty: boolean;
  markClean: () => void;
  reset: () => T;
} {
  const [savedData, setSavedData] = useState<T>(data);

  const isDirty = useMemo(
    () => JSON.stringify(savedData) !== JSON.stringify(data),
    [savedData, data]
  );

  const markClean = useCallback(() => {
    setSavedData(JSON.parse(JSON.stringify(data)) as T);
  }, [data]);

  const reset = useCallback((): T => {
    return JSON.parse(JSON.stringify(savedData)) as T;
  }, [savedData]);

  return { isDirty, markClean, reset };
}
