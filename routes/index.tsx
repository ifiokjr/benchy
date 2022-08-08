/** @jsx h */
import { h } from "preact";
import { objectEntries } from "ts-extras";

import { Handlers, PageProps } from "$fresh/server.ts";
import { FullBenchmark } from "~/types.ts";
import Chart from "../islands/Chart.jsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const entriesUrl = new URL("/runtime/entries.json", req.url);
    const entriesResponse = await fetch(entriesUrl.toString());
    const entries: string[] = await entriesResponse.json();
    const latestEntry = entries.at(-1);

    if (!latestEntry) {
      throw new Error("No entry found");
    }

    // console.log(req.headers);
    console.log(latestEntry);
    const latestUrl = new URL(`/runtime/${latestEntry}`, req.url);
    const latestResponse = await fetch(latestUrl);
    const benchmark: FullBenchmark = await latestResponse.json();
    // console.log(benchmark);
    const resp = await ctx.render(benchmark);
    // console.log(await (resp.clone().text()));
    resp.headers.set("X-Custom-Header", "Hello");
    return resp;
  },
};

export default function Home(props: PageProps<FullBenchmark>) {
  return (
    <div>
      {objectEntries(props.data.entries).map(([name, entries]) => (
        <div>
          <h3>{name}</h3>
          <Chart entries={entries} />
        </div>
      ))}
    </div>
  );
}
