import { Box, Modal, styled, Typography } from "@mui/material"
import { useIntl } from "react-intl"
import { ReactComponent as Close } from "../../../assets/svg/close-ellipse.svg"
import PricesList from "./PricesList"

export default function SeePrices({ openMuiModal, handleClose }) {
  const intl = useIntl()

  const data = [
    {
      to: intl.formatMessage({
        id: "to",
        defaultMessage: "TO"
      }),
      number: "100",
      item: intl.formatMessage({
        id: "item",
        defaultMessage: "ACTIVATED GENERATED"
      }),
      features: [
        intl.formatMessage({
          id: "features1[0]",
          defaultMessage: "100 UNIQUE COMBINATIONS"
        }),
        intl.formatMessage({
          id: "features1[1]",
          defaultMessage: "UNLIMITED PREVIEWS"
        }),
        intl.formatMessage({
          id: "features1[2]",
          defaultMessage: "COLLECTION GENERATION"
        }),
        intl.formatMessage({
          id: "features1[3]",
          defaultMessage: "METADATA"
        })
      ],
      price: intl.formatMessage({
        id: "Free",
        defaultMessage: "FREE"
      })
    },
    {
      to: intl.formatMessage({
        id: "to",
        defaultMessage: "TO"
      }),
      number: "1.000",
      item: intl.formatMessage({
        id: "item",
        defaultMessage: "ACTIVATED GENERATED"
      }),
      features: [
        intl.formatMessage({
          id: "features2[0]",
          defaultMessage: "1000 UNIQUE COMBINATIONS"
        }),
        intl.formatMessage({
          id: "features2[1]",
          defaultMessage: "UNLIMITED PREVIEWS"
        }),
        intl.formatMessage({
          id: "features2[2]",
          defaultMessage: "COLLECTION GENERATION"
        }),
        intl.formatMessage({
          id: "features2[3]",
          defaultMessage: "METADATA"
        })
      ],
      price: "99$"
    },
    {
      to: intl.formatMessage({
        id: "to",
        defaultMessage: "TO"
      }),
      number: "5.000",
      item: intl.formatMessage({
        id: "item",
        defaultMessage: "ACTIVATED GENERATED"
      }),
      features: [
        intl.formatMessage({
          id: "features3[0]",
          defaultMessage: "5000 UNIQUE COMBINATIONS"
        }),
        intl.formatMessage({
          id: "features3[1]",
          defaultMessage: "UNLIMITED PREVIEWS"
        }),
        intl.formatMessage({
          id: "features3[2]",
          defaultMessage: "COLLECTION GENERATION"
        }),
        intl.formatMessage({
          id: "features3[3]",
          defaultMessage: "METADATA"
        }),
        intl.formatMessage({
          id: "features3[4]",
          defaultMessage: "CUSTOM SUPPORT"
        })
      ],
      price: "199$"
    },
    {
      to: intl.formatMessage({
        id: "to",
        defaultMessage: "TO"
      }),
      number: "10.000",
      item: intl.formatMessage({
        id: "item",
        defaultMessage: "ACTIVATED GENERATED"
      }),
      features: [
        intl.formatMessage({
          id: "features4[0]",
          defaultMessage: "10000 UNIQUE COMBINATIONS"
        }),
        intl.formatMessage({
          id: "features4[1]",
          defaultMessage: "UNLIMITED PREVIEWS"
        }),
        intl.formatMessage({
          id: "features4[2]",
          defaultMessage: "COLLECTION GENERATION"
        }),
        intl.formatMessage({
          id: "features4[3]",
          defaultMessage: "METADATA"
        }),
        intl.formatMessage({
          id: "features4[4]",
          defaultMessage: "CUSTOM SUPPORT"
        })
      ],
      price: "299$"
    }
  ]

  return (
    <Modal
      open={openMuiModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={mainContainer}>
          <Box sx={headerContainer}>
            <Typography
              textAlign={"center"}
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{
                color: "white",
                textTransform: "uppercase",
                width: "100%",
                textAlign: "center"
              }}
            >
              Prices
            </Typography>
            <Close
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
              onClick={handleClose}
            />
          </Box>
          <Box sx={divider} />

          <Typography
            textAlign={"center"}
            variant="h5"
            component="h2"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            These are the lists to generate NFTs.
          </Typography>
          <ListItems>
            {data.map((item, index) => (
              <PricesList item={item} key={index} />
            ))}
          </ListItems>
        </Box>
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
  width: { md: "90%", lg: 1200 },
  height: { md: "100%", lg: "79%" },
  bgcolor: "#000446",
  border: "2px solid #00B8FF",
  boxShadow: 24,
  p: 4
}

const mainContainer = {
  height: "80vh",
  overflow: "auto"
}
const headerContainer = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
}

const divider = {
  background: "#00B8FF",
  width: "70%",
  height: "3px",
  margin: "5px  auto"
}

const ListItems = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  width: "100%",
  flexWrap: "wrap",
  marginTop: "5rem",
  marginBottom: "5rem",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    justifyContent: "center"
  }
}))
