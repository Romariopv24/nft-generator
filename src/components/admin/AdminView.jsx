import { Stack } from "@mui/material"
import Graph from "./components/Graph"
import Table from "./components/Table"

export default function AdminView() {
  return (
    <Stack alignItems={"center"}>
      <Stack my={5} mx={"auto"}>
        <Graph />
      </Stack>
      <Stack direction={"row"} mt={1} justifyContent={"center"} width={"80%"}>
        <Table />
      </Stack>
    </Stack>
  )
}
