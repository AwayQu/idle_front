import React, {Component} from 'react';
import * as d3 from 'd3';
import {ClassDiagramRender, ClassDiagramGraph} from "d3-uml/src/uml/uml";
import {Relation} from "d3-uml/src/uml/class-diagram-relationship"
import API from '../api'

class ClassDiagramViewDynamic extends Component {
    constructor(props) {
        super(props);
        this.handleRepoChange = this.handleRepoChange.bind(this);
        this.state = {
            data: [],
            repo: "ios_hello",
        };
    }

    renderGraph(data) {

        var g = new ClassDiagramGraph().setGraph({});

        var classes = data["classes"];
        var relations = data["relations"];

        classes.forEach((v, i) => {
            v.classname = v.className;
            v.x = 0;
            v.y = 0;
            v.width = 260;
            g.setClassDiagramNode(v);
        });

        relations.forEach((v, i) => {
            g.setEdge(v.fromIdentify, v.toIdentify, Relation(v.relation))
        });

        var svg = d3.select(this.chartRef)
            .attr("width", 1500)
            .attr("height", 1200);

        var inner = svg.append("g")

        // Set up zoom support
        var zoom = d3.zoom().on("zoom", function () {
            inner.attr("transform", d3.event.transform);
        });
        svg.call(zoom);

        // Create the renderer
        var render = new ClassDiagramRender();

        render(inner, g);

        // Center the graph
        var initialScale = 0.75;
        svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

        // svg.attr('height', g.graph().height * initialScale + 40);
    }

    handleRepoChange(e) {
        this.setState({repo: e.target.value});
    }

    handleSubmit() {
        API.post('github/project', {
            "url" : this.state.repo
        }).then(res => {
        });
    }

    handleGetDiagram() {
        API.get('github').then(res => {
            this.renderGraph(res.data);
        });
    }



    componentDidMount() {

    }

    render() {


        return (

            <div>
                <form onSubmit={() => this.handleSubmit()}>
                    <input name="repo" value={this.state.repo} onChange={this.handleRepoChange}/>
                    <button type="submit">Submit repo</button>
                </form>

                <form onSubmit={() => this.handleGetDiagram()}>
                    <button type="submit">Submit Get Diagram</button>
                </form>
                <svg className="svg" ref={(r) => this.chartRef = r}/>
            </div>
        );
    }
}

export default ClassDiagramViewDynamic;