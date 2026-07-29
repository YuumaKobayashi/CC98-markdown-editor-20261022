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

/**
 * P13 compatibility stub.
 *
 * Annual review routes are temporarily unavailable while the project has no
 * chart renderer that supports the single React 18 runtime. Keep the contract
 * so the dormant annual-review sources remain type-checkable until the feature
 * receives a replacement renderer.
 */
export function IntervalChart(_props: IntervalChartProps): null {
  return null;
}
