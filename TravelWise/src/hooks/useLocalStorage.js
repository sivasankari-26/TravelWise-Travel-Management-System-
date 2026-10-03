import { useState, useEffect } from 'react';

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null || stored === undefined) {
        return defaultValue;
      }
      const parsed = JSON.parse(stored);
      if (parsed === null || parsed === undefined) {
        return defaultValue;
      }
      return parsed;
    } catch (error) {
      console.error(`useLocalStorage: failed to parse "${key}", using default.`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`useLocalStorage: failed to save "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}