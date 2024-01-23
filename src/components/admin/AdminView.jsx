import { Stack } from "@mui/material"
import axios from "axios"
import { useEffect } from "react"
import { URL } from "../../constantes"
import { useStoreSignal } from "../../utils/zustand/store"
import Graph from "./components/Graph"
import Table from "./components/Table"

export default function AdminView() {
  const { access_token, dataAdmin, setDataAdmin } = useStoreSignal((state) => ({
    access_token: state.access_token,
    dataAdmin: state.dataAdmin,
    setDataAdmin: state.setDataAdmin
  }))

  const getDataTable = async () => {
    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": true,
      Pragma: "no-cache",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        localStorage.getItem("access_token") || access_token
      }`
    }
    const response = await axios({
      method: "get",
      url: `${URL}/history`,
      headers: headers
    })
      .then((res) => setDataAdmin(res.data))
      .catch((err) => console.log(err))

    return response
  }
  useEffect(() => {
    getDataTable()
  }, [])


  return (
    <Stack alignItems={"center"}>
      <Stack my={5} mx={"auto"}>
        <Graph />
      </Stack>
      <Stack direction={"row"} mt={1} justifyContent={"center"} width={"80%"}>
        <Table dataAdmin={dataAdmin} />
      </Stack>
    </Stack>
  )
}
