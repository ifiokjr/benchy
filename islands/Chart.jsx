/** @jsx h */
import { Fragment, h } from "preact";

import capitalize from "https://esm.sh/just-capitalize@3.1.0";
import { useState } from "preact/hooks";
import { VictoryAxis } from "victory-axis";
import { VictoryBar } from "victory-bar";
import { VictoryChart } from "victory-chart";

const KEYS = [
  "avg",
  "min",
  "max",
  "p75",
  "p99",
  "p995",
  "p999",
];

const defaultKey = "p75";

export default function Chart(props) {
  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const tickValues = props.entries.sort((a, z) =>
    a[selectedKey] - z[selectedKey]
  ).map((value) => value.runtime);
  const tickFormat = tickValues.map((value, index) => {
    const name = capitalize(value);
    return index === 0 ? `${name} 🎉` : name;
  });

  return (
    <Fragment>
      {
        /* <select>
        {KEYS.map((key) => (
          <option value={key} key={key} selected={selectedKey === key}>
            {key}
          </option>
        ))}
      </select> */
      }
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={tickValues}
          tickFormat={tickFormat}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => duration(x)}
        />
        <VictoryBar
          data={props.entries}
          x="runtime"
          y={selectedKey}
        />
      </VictoryChart>
    </Fragment>
  );
}

function duration(time, locale = "en-us") {
  if (time < 1e0) {
    return `${Number((time * 1e3).toFixed(2)).toLocaleString(locale)}ps`;
  }

  if (time < 1e3) return `${Number(time.toFixed(2)).toLocaleString(locale)}ns`;
  if (time < 1e6) {
    return `${Number((time / 1e3).toFixed(2)).toLocaleString(locale)}µs`;
  }
  if (time < 1e9) {
    return `${Number((time / 1e6).toFixed(2)).toLocaleString(locale)}ms`;
  }
  if (time < 1e12) {
    return `${Number((time / 1e9).toFixed(2)).toLocaleString(locale)}s`;
  }
  if (time < 36e11) {
    return `${Number((time / 60e9).toFixed(2)).toLocaleString(locale)}m`;
  }

  return `${Number((time / 36e11).toFixed(2)).toLocaleString(locale)}h`;
}
