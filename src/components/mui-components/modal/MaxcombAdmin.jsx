import { Box, Modal, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export default function MaxcombAdmin({openMaxComb, setOpenMaxComb}) {
  return (
    <Modal
    open={openMaxComb}
    onClose={() => setOpenMaxComb(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
      <Box sx={style}>
        <Typography textAlign={'center'} variant="h4" component="h2" gutterBottom>
        <FormattedMessage
          id="generator.max-admin"
          defaultMessage="Max of the total combinations must be 11.150"
        />
        </Typography>
        <button
          className="__boton-mediano"
          onClick={() => setOpenMaxComb(false)}
        >
          <FormattedMessage id="form.btn-close" defaultMessage="Close" />
        </button>
      </Box>

  </Modal>
  )
}

const style = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '30%',
    height: '25%',
    bgcolor: "#000446",
    border: "2px solid #00B8FF",
    boxShadow: 24,
    p: 4
  }
  