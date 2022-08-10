export type Command = () => Promise<string | undefined>;
export type RuntimeCommands = Record<Runtime, string[] | Command>;
export type Runtime = "node" | "deno" | "bun";

export interface BenchmarkEntry {
  runtime: "deno" | "bun" | "node";
  name: string;
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

export interface FullBenchmark {
  cpu: string;
  arch: string;
  versions: {
    deno: string;
    bun: string;
    node: string;
  };

  entries: Record<string, BenchmarkEntry[]>;
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
