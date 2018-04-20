import React, {Component} from 'react';
import * as d3 from 'd3';
import {ClassDiagramRender, ClassDiagramGraph} from "d3-uml/src/uml/uml";
import {Relation} from "d3-uml/src/uml/class-diagram-relationship"
import API from '../api'
import {Treebeard} from "react-treebeard";

const data = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                {name: 'child1'},
                {name: 'child2'}
            ]
        },
        {
            name: 'loading parent',
            loading: true,
            children: []
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        {name: 'nested child 1'},
                        {name: 'nested child 2'}
                    ]
                }
            ]
        }
    ]
};

class TreeExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({cursor: node});
    }

    render() {
        const treeStyle = {
            width: '20%',
            height: '100%',
            display: 'inline-block',
            verticalAlign: "top"

        }
        return (
            <div style={treeStyle}>
                <Treebeard

                    data={data}
                    onToggle={this.onToggle}
                />
            </div>
        );
    }
}

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

        //region clear previous data
        var inner = svg.select("g");
        if (!inner.node()) {
            inner = svg.append("g")
        }
        //endregion

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
            "url": this.state.repo
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

        const svgStyle = {
            background: "yellow",
            verticalAlign: "top",
            display: "inline-block",
            width:"80%"
        }
        return (

            <div>
                <form onSubmit={() => this.handleSubmit()}>
                    <input name="repo" value={this.state.repo} onChange={this.handleRepoChange}/>
                    <button type="submit">Submit repo</button>
                </form>

                <form onSubmit={() => this.handleGetDiagram()}>
                    <button type="submit">Submit Get Diagram</button>
                </form>
                <TreeExample/>
                <svg className="svg" style={svgStyle} ref={(r) => this.chartRef = r}/>
            </div>
        );
    }
}

export default ClassDiagramViewDynamic;