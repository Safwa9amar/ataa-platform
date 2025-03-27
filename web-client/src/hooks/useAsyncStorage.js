export const useAsyncStorage = () => {
  const getItem = async (key) => {
    return new Promise((resolve, reject) => {
      try {
        const value = localStorage.getItem(key);
        resolve(value ? JSON.parse(value) : null);
      } catch (error) {
        reject(`Error getting item ${key} from localStorage: ${error}`);
      }
    });
  };

  const setItem = async (key, value) => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      } catch (error) {
        reject(`Error setting item ${key} in localStorage: ${error}`);
      }
    });
  };

  const removeItem = async (key) => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(key);
        resolve();
      } catch (error) {
        reject(`Error removing item ${key} from localStorage: ${error}`);
      }
    });
  };

  return { getItem, setItem, removeItem };
};
