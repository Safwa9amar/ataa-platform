// src/hooks/useDebouncedCallback.js

import { useRef, useCallback } from 'react';

const useDebouncedCallback = (callback, delay=1000) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

export default useDebouncedCallback;
