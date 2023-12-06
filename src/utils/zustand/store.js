import { create } from "zustand"

//Va pues cree un store pa un conio... pero bueno espero que algun dia se use porque este proyecto esta horrible
export const useStoreSignal = create((set) => ({
  signal: false,
  setSignal: () => set((state) => ({ signal: !state.signal }))
}))
