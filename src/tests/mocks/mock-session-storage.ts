export const mockSessionStorage = (() => {
  let store: any = {};
  return {
    getItem(key: any) {
        return store[key] ?? null;
    },
    setItem(key: any, value: any) {
        store[key] = value.toString();
    },
    removeItem(key: any) {
        delete store[key];
    },
    clear() {
        store = {};
    }
  };
})();