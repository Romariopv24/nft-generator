import { Box, Button, styled } from "@mui/material"

export default function PricesList({ item }) {
  return (
    <MainContainer>
      <span>
        <ItemTitle>{item.to}</ItemTitle>
        <ItemNumber>{item.number}</ItemNumber>
        <ItemTitle>{item.item}</ItemTitle>
        <div
          style={{
            minHeight: ".5em",
            borderRadius: "20px",
            backgroundColor: "transparent",
            width: "100%",
            marginTop: "1.5em",
            marginBottom: "1.5em"
          }}
        />
        {item.features.map((feature, index) => (
          <ItemFeature key={index}>
            <Bullet />
            {feature}
          </ItemFeature>
        ))}
      </span>
      <RoundButton>{item.price}</RoundButton>
    </MainContainer>
  )
}

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  boxShadow: "9px 12px 30px 8px rgba(0,0,0,0.137)",
  margin: "1em",
  borderRadius: "20px",
  padding: "1em",
  alignItems: "center",
  minWidth: "270px",
  maxWidth: "380px",
  minHeight: "450px",
  border: "2px solid #00B8FF",
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    margin: ".7em"
  },
  [theme.breakpoints.up("lg")]: {
    margin: ".7em",
    minWidth: "230px"
  }
}))

const ItemTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  fontSize: ".9em",
  fontWeight: "800",
  justifyContent: "center"
}))

const ItemNumber = styled(Box)(({ theme }) => ({
  display: "flex",
  fontSize: "4em",
  fontWeight: "800",
  color: "#6b78b8",
  justifyContent: "center",
  alignItems: "center",
  lineHeight: ".9em"
}))

const ItemFeature = styled(Box)(({ theme }) => ({
  display: "flex",
  fontSize: ".84em",
  fontWeight: "800",
  alignSelf: "flex-start",
  margin: ".75em",
  color: "#fff",
  alignItems: "center",
  gap: 3
}))

const Bullet = styled(Box)(({ theme }) => ({
  backgroundColor: "#6b78b8",
  borderRadius: "100px",
  padding: ".4em",
  margin: ".4em"
}))

const RoundButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#6b78b8",
  // marginTop: "2em",
  // marginBottom: "1.2em",
  borderRadius: "20px",
  color: "white",
  minWidth: "12em",
  fill: "white",
  pointerEvents: "none",
  "&:hover": {
    color: "#fff",
    backgroundColor: `#6b78b8`,
    cursor: "default"
    // border: `.5px sol#8092e9lor}`,
    // fill: color
  },
  [theme.breakpoints.up("xl")]: {
    transform: "scale(1.2) translateX(2px)"
    // transform: "translateX(2px)"
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "10em"
  }
}))
