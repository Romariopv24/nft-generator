import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart"
import { useIntl } from "react-intl"

export default function Graph({ dataAdmin }) {
  const intl = useIntl()

  const seenEmails = {}

  const uniqueEmailData = dataAdmin.filter((value) =>
    seenEmails[value.correo] ? false : (seenEmails[value.correo] = true)
  )
  const dataUserEmail = uniqueEmailData.map((value) => value.correo)
  const dataUserCollection = dataAdmin.map((value) => value.cantidad)

  const data = [
    {
      id: 0,
      value: dataUserEmail.length,
      label: intl.formatMessage({
        id: "graph.data.value.user",
        defaultMessage: "Users"
      })
    },
    {
      id: 1,
      value: dataUserCollection.length,
      label: intl.formatMessage({
        id: "graph.data.value.collection",
        defaultMessage: "Collections"
      })
    }
  ]
  return (
    <PieChart
      series={[
        {
          data,
          arcLabel: (item) => `${item.value}`,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          innerRadius: 81,
          outerRadius: 200,
          paddingAngle: 2,
          cornerRadius: 3,
          startAngle: -203,
          endAngle: 199
        }
      ]}
      width={1500}
      height={500}
      // margin={{ top: 50, bottom: 50, left: 50, right: 50 }}
      slotProps={{
        legend: {
          labelStyle: {
            fontSize: 14,
            fill: "#fff"
          },
          padding: 180,
          position: { vertical: "middle", horizontal: "left" }
        }
      }}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: "white",
          fontWeight: "bold"
        },
        [`& .css-1mhcdve-MuiPieArc-root `]: {
          stroke: "#000"
        }
      }}
    />
  )
}
