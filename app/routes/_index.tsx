import type {MetaFunction} from "@remix-run/node";
import {dataClouds, WordCloud} from "~/components/WordCloud";
import {Chart, chartData} from "~/components/Chart";
import {EChartVariants} from "~/components/Chart/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <WordCloud data={dataClouds} />
      <hr />
      <Chart data={chartData} variantChart={EChartVariants.Variant1} />
    </div>
  );
}
