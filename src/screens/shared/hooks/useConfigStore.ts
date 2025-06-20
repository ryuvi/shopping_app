// store/useConfigStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ConfigState = {
  limite: number;
  setLimite: (valor: number) => void;
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      limite: 500, // valor padrão
      setLimite: (valor) => set({ limite: valor }),
    }),
    {
      name: "config-store", // chave usada no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useConfig = () => useConfigStore((state) => state);
