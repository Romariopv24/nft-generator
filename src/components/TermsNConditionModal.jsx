import { Backdrop, Box, Fade, Modal } from "@mui/material"
import { FormattedMessage } from "react-intl"
import Terms from "../pages/terms"

export const TermsNConditionModal = ({ showTerms, setShowTerms }) => {
  const close = () => {
    setShowTerms(false)
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={showTerms}
      onClose={setShowTerms}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={showTerms}>
        <Box sx={style}>
          <Box sx={{ overflow: "auto", height: "70vh" }}>
            <Terms  close={close}/>
            <div className="p-2 mb-2">
              <button
                className="__boton-mediano enphasis-button"
                onClick={close}
              >
                <FormattedMessage
                  id="legalwarning.button"
                  defaultMessage="Accept"
                />
              </button>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "560px",
  bgcolor: "#000446",
  boxShadow: 24,
  p: 4,
  border: "1px solid #00B8FF",
  display: "flex",
  justifyContent: "start",
  flexDirection: "column",
  textAlign: "center",
  alignItems: "center"
}
