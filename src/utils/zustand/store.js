import { create } from "zustand"

//Va pues cree un store pa un conio... pero bueno espero que algun dia se use porque este proyecto esta horrible
// Al final si se uso esta mieldaaa ajajaja
const useStoreSignal = create((set) => ({
  signal: false,
  setSignal: () => set((state) => ({ signal: !state.signal })),
  access_token: "",
  setAccess_token: (newState) => set((state) => ({ access_token: newState })),
  dataAdmin: [],
  setDataAdmin: (newData) => set(() => ({ dataAdmin: newData }))
}))

export { useStoreSignal }
