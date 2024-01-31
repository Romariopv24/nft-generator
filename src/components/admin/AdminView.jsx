import { Button, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../../constantes";
import { useStoreProv } from "../../utils/zustand/store";
import AssingWalletsModal from "./components/AssingWalletsModal";
import Graph from "./components/Graph";
import Table from "./components/Table";
import { FormattedMessage } from "react-intl";

export default function AdminView() {
  const { access_token, dataAdmin, setDataAdmin } = useStoreProv((state) => ({
    access_token: state.access_token,
    dataAdmin: state.dataAdmin,
    setDataAdmin: state.setDataAdmin,
  }));

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getDataTable = async () => {
    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": true,
      Pragma: "no-cache",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        localStorage.getItem("access_token") || access_token
      }`,
    };
    const response = await axios({
      method: "get",
      url: `${URL}/history`,
      headers: headers,
    })
      .then((res) => setDataAdmin(res.data))
      .catch((err) => console.log(err));

    return response;
  };
  useEffect(() => {
    getDataTable();
  }, []);

  return (
    <Stack alignItems={"center"} width={"100%"}>
      <Stack my={5} mx={"auto"}>
        <Graph dataAdmin={dataAdmin} />
      </Stack>
      <Stack width={"60%"} my={2}>
        <Button sx={buttonWallets} onClick={handleOpen}>
          <FormattedMessage
            id="assing.wallet.button"
            defaultMessage="Assing Wallets."
          />
        </Button>
        <AssingWalletsModal open={open} handleClose={handleClose} />
      </Stack>
      <Stack direction={"row"} mt={1} justifyContent={"center"} width={"80%"}>
        <Table dataAdmin={dataAdmin} />
      </Stack>
    </Stack>
  );
}

const buttonWallets = {
  backgroundColor: "#2731C8",
  width: "10vw",
  height: "100%",
  borderRadius: "20px",
  color: "white",
  "&:hover": {
    backgroundColor: "#6B78B8",
    color: "white",
  },
};
