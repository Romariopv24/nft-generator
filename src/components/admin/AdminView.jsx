import { Stack } from "@mui/material";
import Graph from "./components/Graph";
import Table from "./components/Table";

export default function AdminView() {
  return (
    <Stack alignItems={"center"}>
      <div style={{ width: "100vw", height: "60vh", marginTop: "2rem" }}>
        <Graph />
      </div>
      <Stack direction={"row"} mt={1} justifyContent={"center"} width={"80%"}>
        <Table />
      </Stack>
    </Stack>
  );
}
