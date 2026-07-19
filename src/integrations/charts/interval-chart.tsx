import * as React from "react";
import { Axis, Chart, Interval, Tooltip } from "bizcharts";

export interface IntervalChartProps {
  autoFit?: boolean;
  crosshair?: "x" | "y";
  data: Array<Record<string, unknown>>;
  height: number;
  width: number;
  xField: string;
  yAlias?: string;
  yField: string;
}

export function IntervalChart({
  autoFit = true,
  crosshair = "y",
  data,
  height,
  width,
  xField,
  yAlias,
  yField,
}: IntervalChartProps) {
  const scale = yAlias ? { [yField]: { alias: yAlias } } : undefined;

  return (
    <Chart autoFit={autoFit} width={width} height={height} data={data} scale={scale}>
      <Axis name={xField} />
      <Axis name={yField} />
      <Tooltip showCrosshairs crosshairs={{ type: crosshair }} />
      <Interval position={`${xField}*${yField}`} />
    </Chart>
  );
}
