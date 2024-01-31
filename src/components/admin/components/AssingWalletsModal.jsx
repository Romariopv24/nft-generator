import { Close, Send } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import TableWallets from "./TableWallets";
import { FormattedMessage, useIntl } from "react-intl";

export default function AssingWalletsModal({ open, handleClose }) {
  const intl = useIntl();


  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={boxClose}>
              <Close onClick={handleClose} sx={icon} />
            </Box>

            <Typography
              id="transition-modal-title"
              variant="h4"
              component="h2"
              sx={{
                color: "white",
              }}
            >
              <FormattedMessage
                id="assing.wallet.title"
                defaultMessage="Free Wallets"
              />
            </Typography>
            <Box sx={divider} />
            <Typography
              color={"white"}
              id="transition-modal-description"
              sx={{ mt: 5, fontSize: "20px" }}
              component="h4"
            >
              <FormattedMessage
                id="assing.wallet.subtitle"
                defaultMessage="Enter the wallet that you want to be free"
              />
            </Typography>
            <Stack sx={boxWalletSend}>
              <OutlinedInput
                sx={outLinedInputStyle}
                placeholder={intl.formatMessage({
                  id: "assing.wallet.placeholder",
                  defaultMessage: "Enter a wallet 0x...",
                })}
              />
              <Send sx={icon} />
            </Stack>

            <TableWallets />
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "90%", md: "90%", lg: "60%", xl: "45%" },
  bgcolor: "#000446",
  boxShadow: 24,
  p: 4,
  border: "1px solid #00B8FF",
  display: "flex",
  justifyContent: "start",
  flexDirection: "column",
  textAlign: "center",
  alignItems: "center",
};

const outLinedInputStyle = {
  border: "1px solid #00B8FF",
  borderRadius: "15px",
  marginTop: 3.5,
  marginBottom: 3.5,
  color: "white",
  width: "95%",
};

const boxWalletSend = {
  display: "flex",
  flexDirection: "row",
  width: "80%",
  alignItems: "center",
  gap: 2,
};

const divider = {
  background: "#00B8FF",
  width: "50%",
  height: "3px",
};

const icon = {
  cursor: "pointer",
  color: "#00B8FF",
};

const boxClose = {
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
};
