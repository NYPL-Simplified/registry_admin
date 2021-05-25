import * as React from "react";
import { ResponsiveContainer, PieChart, Pie, Sector, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { LibraryData } from "../interfaces";

export interface ChartsProps {
  data: {[key: string]: LibraryData[]};
  width?: string | number;
  height?: string | number;
}

/** The "Charts" tab in the "Aggregate Data" panel.  Uses the external "recharts" package. */
export default class Charts extends React.Component<ChartsProps, {}> {
  static defaultProps = {
    width: "50%",
    height: 400
  };

  render() {
    const colors = {
      "production": "#809F69",
      "testing": "#FFCD61",
      "cancelled": "#DA5D62"
    };
    const { width, height } = this.props;
    let chartData = Object.keys(this.props.data).map((category) => {
      return { "name": category, "value": this.props.data[category].length };
    });

    return (
        <div className="chart-view">
          <ResponsiveContainer width={width} height={height}>
            <PieChart ref="pie-chart-svg">
              <Legend
                payload={ chartData.map(
                  item => ({
                    id: item.name,
                    type: "diamond",
                    value: item.name,
                    color: colors[item.name],
                  })
                )}
                layout="vertical"
                height={60}
                width={200}
                align="center"
                verticalAlign="bottom"
              />
              <Pie label data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width={width} height={height}>
            <BarChart ref="bar-chart-svg" width={400} height={400} data={chartData}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="name" interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" barSize={40} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
