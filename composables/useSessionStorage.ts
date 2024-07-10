export function useSessionStorage<T>() {
  const setItem = (key: string, data: T) => {
    if (import.meta.client) {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  };

  const getItem = (key: string): T | null => {
    if (import.meta.client) {
      try {
        const value = sessionStorage.getItem(key);
        if (value == null) {
          return null;
        }
        return JSON.parse(value);
      } catch {
        console.error("Could not parse session storage item");
        return null;
      }
    }
    return null;
  };

  const removeItem = (key: string) => {
    sessionStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
}
