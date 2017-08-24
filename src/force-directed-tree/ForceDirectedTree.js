import React, {Component} from "react";
import * as d3 from 'd3';
// https://bl.ocks.org/mbostock/95aa92e2f4e8345aaa55a4a94d41ce37
// https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html#installation
export default class ForceDirectedTree extends Component {

  componentDidMount() {
    const nodes = d3.range(1000).map(function (i) {
      return {
        index: i
      };
    });

    const links = d3.range(nodes.length - 1).map(function (i) {
      return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1
      };
    });
    const context = this.canvasRef.getContext("2d");

    const simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink(links).distance(20).strength(1))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .on("tick", () => {
          context.clearRect(0, 0, width, height);
          context.save();
          context.translate(width / 2, height / 2);

          context.beginPath();
          links.forEach((d) => {
            context.moveTo(d.source.x, d.source.y);
            context.lineTo(d.target.x, d.target.y);
          });
          context.strokeStyle = "#aaa";
          context.stroke();

          context.beginPath();
          nodes.forEach((d) => {
            context.moveTo(d.x + 3, d.y);
            context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
          });
          context.fill();
          context.strokeStyle = "#fff";
          context.stroke();

          context.restore();
    });

    const canvas = this.canvasRef;

    const width = canvas.width;
    const height = canvas.height;
    d3.select(canvas)
      .call(d3.drag()
        .container(canvas)
        .subject(() => {
          return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
        })
        // .on("start", dragstarted)
        // .on("drag", dragged)
        // .on("end", dragended)
    );
  }

  render() {
    return (
      <div>
        <canvas width="960" height="960" style={{align: 'center'}} ref={(r) => this.canvasRef = r}/>
        {/*<svg className="bar-chart--stack" ref={(r) => this.chartRef = r}/>*/}
      </div>
    );
  }
}