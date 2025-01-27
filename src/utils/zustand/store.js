import { create } from "zustand"

const useStoreProv = create((set) => ({
  signal: false,
  setSignal: () => set((state) => ({ signal: !state.signal })),
  access_token: "",
  setAccess_token: (newState) => set((state) => ({ access_token: newState })),
  dataAdmin: [],
  setDataAdmin: (newData) => set(() => ({ dataAdmin: newData })),
  nameUser: "",
  setNameUser: (newName) => set(() => ({ nameUser: newName })),
  email: "",
  setEmail: (newEmail) => set(() => ({ email: newEmail })),
  signalToken: false,
  setSignalToken: (state) => set(() => ({ signalToken: !state.signal })),
  typeUser: "",
  setTypeUser: (state) => set(() => ({ typeUser: state })),
  payConfirm: false,
  setPayConfirm: (state) => set(() => ({ payConfirm: state })),
  disableCloseButton: false,
  setDisableCloseButton: (state) => set(() => ({ disableCloseButton: state }))
}))

export { useStoreProv }
