import { create } from "zustand"


//Va pues cree un store pa un conio... pero bueno espero que algun dia se use porque este proyecto esta horrible
export const useStore = create((set) => ({
  handleEraseData: {delete: () => {}},
  setHandleEraseData: (func) => set((state) => ({ handleEraseData: state.handleEraseData.delete = func }))
}))
