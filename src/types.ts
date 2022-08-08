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
