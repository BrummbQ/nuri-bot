export function useLocalStorage<T>() {
  const setItem = (key: string, data: T) => {
    if (import.meta.client) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const getItem = (key: string): T | null => {
    if (import.meta.client) {
      try {
        const value = localStorage.getItem(key);
        if (value == null) {
          return null;
        }
        return JSON.parse(value);
      } catch {
        console.error("Could not parse local storage item");
        return null;
      }
    }
    return null;
  };

  const removeItem = (key: string) => {
    if (import.meta.client) {
      localStorage.removeItem(key);
    }
  };

  return { setItem, getItem, removeItem };
}
