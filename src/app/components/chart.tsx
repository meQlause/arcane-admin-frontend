import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const RoundedRectangle = (props: any) => {
  const { x, y, width, height, fill, stroke, strokeWidth } = props;

  return (
    <rect
      x={x + width / 4}
      y={y}
      width={width / 2}
      height={height}
      rx={width / 4}
      ry={width / 4}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

const CustomTooltip = ({ active, payload, label, coordinate }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white font-maven-pro px-3 py-2 rounded-xl -mx-2">
        <span className="sr-only">{label}</span>
        <span className="font-bold">{payload[0].value}</span>
        <span className="text-sm">
          {" "}
          {payload[0].value > 1 ? "Proposals" : "Proposal"}
        </span>
      </div>
    );
  }
  return null;
};

export default function Chart({ data }: any) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="recharts-responsive"
    >
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "none" }} />
        <Bar
          dataKey="total"
          background={{ fill: "none" }}
          shape={<RoundedRectangle fill="#E9CD92" />}
          activeBar={
            <RoundedRectangle fill="#99804B" stroke="#E9CD92" strokeWidth="3" />
          }
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
