import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart"
export default function Graph() {
  const data = [
    { id: 0, value: 10, label: "series A" },
    { id: 1, value: 15, label: "series B" },
    { id: 2, value: 20, label: "series C" },
    { id: 3, value: 20, label: "series D" },
    { id: 4, value: 20, label: "series F" }
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
          padding: 0,
          position: { vertical: "middle", horizontal: "left" }
        }
      }}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: "white",
          fontWeight: "bold"
        },
        [`& .css-1mhcdve-MuiPieArc-root `]: {
          stroke: '#000'
        }
      }}
    />
  )
}

// MuiPieArc-root MuiPieArc-series-auto-generated-id-0 css-1mhcdve-MuiPieArc-root
