import './index.less';
import React, {Component} from 'react';
import * as d3 from 'd3';
import {ClassDiagramRender, ClassDiagramGraph} from "d3-uml/src/uml/uml";
import {Relation} from "d3-uml/src/uml/class-diagram-relationship"
import API from '../api'
import {gData, getRadioSelectKeys} from "./util";
import Tree, {TreeNode} from 'rc-tree';
import PropTypes from 'prop-types';

class RadioTree extends React.Component {
    static propTypes = {
        multiple: PropTypes.bool,
    };
    static defaultProps = {
        visible: false,
        multiple: true,
    };

    state = {
        // expandedKeys: getFilterExpandedKeys(gData, ['0-0-0-key']),
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        checkStrictlyKeys: {checked: [], halfChecked: []},
        selectedKeys: [],
        treeData: [],
    };

    constructor(props) {
        super(props);
        this.style = props.style;
        this.onCheckKeys = props.onCheckKeys;
    }

    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded chilren keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys) => {
        console.log(checkedKeys);
        this.setState({
            checkedKeys,
        });
        this.onCheckKeys(checkedKeys)
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', selectedKeys, info);
        this.setState({
            selectedKeys,
        });

    }
    triggerChecked = () => {
        this.setState({
            checkedKeys: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
        });
    }

    render() {
        /**
         * value format: [{ key: "key", title: "child", children:["", ""]}]
         */
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode
                            key={item.key} title={item.title}
                            // disableCheckbox={item.key === '0-0-0-key'}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.key} title={item.title}/>;
            });
        };


        // console.log(getRadioSelectKeys(gData, this.state.selectedKeys));
        return (<div style={this.style}>

            <h2>controlled</h2>
            <Tree
                checkable defaultExpandAll
                onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
            >
                {loop(gData)}
            </Tree>
            <button onClick={this.triggerChecked}>trigger checked</button>
        </div>);
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

    onCheckKeys(checkedKeys) {
        console.log(checkedKeys)
    }

    render() {

        const treeStyle = {
            width: '30%',
            height: '100%',
            display: 'inline-block',
            verticalAlign: "top",
            // padding: '0 20px'
        }
        const svgStyle = {
            background: "yellow",
            verticalAlign: "top",
            display: "inline-block",
            width: "70%"
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
                <RadioTree style={treeStyle} onCheckKeys={this.onCheckKeys}/>
                <svg className="svg" style={svgStyle} ref={(r) => this.chartRef = r}/>
            </div>
        );
    }
}

export default ClassDiagramViewDynamic;