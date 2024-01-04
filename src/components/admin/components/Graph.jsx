import { ResponsivePie } from "@nivo/pie";

export default function Graph() {
  const data = [
    {
      id: "c",
      label: "c",
      value: 83,
      color: "hsl(158, 70%, 50%)",
    },
    {
      id: "go",
      label: "go",
      value: 531,
      color: "hsl(10, 70%, 50%)",
    },
    {
      id: "erlang",
      label: "erlang",
      value: 2,
      color: "hsl(77, 70%, 50%)",
    },
    {
      id: "sass",
      label: "sass",
      value: 29,
      color: "hsl(226, 70%, 50%)",
    },
    {
      id: "python",
      label: "python",
      value: 597,
      color: "hsl(20, 70%, 50%)",
    },
  ];

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#fff"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "ruby",
          },
          id: "dots",
        },
        {
          match: {
            id: "c",
          },
          id: "dots",
        },
        {
          match: {
            id: "go",
          },
          id: "dots",
        },
        {
          match: {
            id: "python",
          },
          id: "dots",
        },
        {
          match: {
            id: "scala",
          },
          id: "lines",
        },
        {
          match: {
            id: "lisp",
          },
          id: "lines",
        },
        {
          match: {
            id: "elixir",
          },
          id: "lines",
        },
        {
          match: {
            id: "javascript",
          },
          id: "lines",
        },
      ]}
      legends={[
        {
          anchor: "left",
          direction: "column",
          justify: false,
          translateX: 200,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 57,
          itemTextColor: "#fff",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 38,
          symbolShape: "circle",
          
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#fff",
                color: "#fff",
              },
            },
          ],
        },
      ]}
    />
  );
}
