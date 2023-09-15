import dynamic from "next/dynamic";

const ChartComponent = dynamic(() => import("./Chart"), {
  ssr: false,
});

export default ChartComponent;
