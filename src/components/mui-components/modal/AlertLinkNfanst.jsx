import { Close } from "@mui/icons-material";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import React from "react";
import { URLNFanst } from "../../../constantes";
import { useIntl } from "react-intl";

export const AlertLinkNfanst = ({ openModal, handleClose }) => {
  const intl = useIntl();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openModal}>
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
              textAlign: "left",
            }}
          >
            {intl.formatMessage({
              id: "title.alertLink",
              defaultMessage: "Alert",
            })}
          </Typography>
          <Box sx={divider} />
          <Typography
            color={"white"}
            id="transition-modal-description"
            sx={{ mt: 3, fontSize: "20px" }}
            component="h4"
          >
            {intl.formatMessage({
              id: "paragraph.alertLink",
              defaultMessage: "You must be logged in to access this page",
            })}
          </Typography>
          <Typography
            color={"white"}
            id="transition-modal-description"
            sx={{ fontSize: "20px" }}
            component="h4"
          >
            {intl.formatMessage({
              id: "paragraph.alertLink2",
              defaultMessage: "Please go to NFansT to connect your wallet",
            })}
          </Typography>
          <Box mt={4} display={"flex"} flexDirection={"row"} gap={4}>
            <Button
              onClick={handleClose}
              sx={{
                backgroundColor: "red",
                color: "white",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#8B0000",
                  color: "white",
                },
              }}
            >
              {intl.formatMessage({
                id: "button.cancel.alertLink",
                defaultMessage: "Close",
              })}
            </Button>
            <Button
              sx={buttonOk}
              onClick={() => (window.location.href = URLNFanst)}
            >
              {intl.formatMessage({
                id: "button.goToNFT",
                defaultMessage: "Go to NFansT",
              })}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //   width: { xs: "90%", sm: "90%", md: "90%", lg: "60%", xl: "45%" },
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

const buttonOk = {
  backgroundColor: "#6B78B8",
  height: "100%",
  borderRadius: "20px",
  color: "white",
  "&:hover": {
    backgroundColor: "#2731C8",
    color: "white",
  },
};
