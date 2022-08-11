export type Os = typeof Deno.build.os;
export type Command = (os: Os) => Promise<Entry[]>;
export type RuntimeCommands = Record<Runtime, string[] | Command>;
export type Runtime = "node" | "deno" | "bun";

export type Timestamps = {
  [Timestamp: number]: Partial<Record<Os, string>>;
};

interface BaseEntry {
  name: string;
  runtime: Runtime;
  /**
   * - When sorting is `-1` the lower value is a better result.
   * - When sorting is `+1` the higher value is a better result.
   *
   * Example:
   *
   * TimePerIteration has a sorting of `-1` which means a lower time per iteration is better.
   */
  sorting: -1 | 1;
}

export interface TimePerIterationEntry extends BaseEntry {
  type: "timePerIteration";
  time: number;
  n: number;
  avg: number;
  min: number;
  max: number;
  p75: number;
  p99: number;
  p995: number;
  p999: number;
}

export interface ThroughputEntry extends BaseEntry, Throughput {
  type: "throughput";
  time: number;
  sorting: 1;
}

export interface LatencyEntry extends BaseEntry, Latency {
  type: "latency";
  time: number;
  sorting: -1;
}

export interface RequestsEntry extends BaseEntry, Requests {
  type: "requests";
  time: number;
  sorting: 1;
}

export type Entry =
  | TimePerIterationEntry
  | ThroughputEntry
  | LatencyEntry
  | RequestsEntry;

export interface FullBenchmark {
  os: Os;
  versions: Record<Runtime, string>;
  entries: { [Name: string]: Entry[] };
}

export interface AutoCannon {
  url: string;
  connections: number;
  sampleInt: number;
  pipelining: number;
  workers: number;
  duration: number;
  samples: number;
  start: string;
  finish: string;
  errors: number;
  timeouts: number;
  mismatches: number;
  non2xx: number;
  resets: number;
  "1xx": number;
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
  statusCodeStats: StatusCodeStats;
  latency: Latency;
  requests: Requests;
  throughput: Throughput;
}

interface Throughput {
  average: number;
  mean: number;
  stddev: number;
  min: number;
  max: number;
  total: number;
  p0_001: number;
  p0_01: number;
  p0_1: number;
  p1: number;
  p2_5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p97_5: number;
  p99: number;
  p99_9: number;
  p99_99: number;
  p99_999: number;
}

interface Requests {
  average: number;
  mean: number;
  stddev: number;
  min: number;
  max: number;
  total: number;
  p0_001: number;
  p0_01: number;
  p0_1: number;
  p1: number;
  p2_5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p97_5: number;
  p99: number;
  p99_9: number;
  p99_99: number;
  p99_999: number;
  sent: number;
}

interface Latency {
  average: number;
  mean: number;
  stddev: number;
  min: number;
  max: number;
  p0_001: number;
  p0_01: number;
  p0_1: number;
  p1: number;
  p2_5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p97_5: number;
  p99: number;
  p99_9: number;
  p99_99: number;
  p99_999: number;
  totalCount: number;
}

interface StatusCodeStats {
  "200": _200;
}

interface _200 {
  count: number;
}
