import './index.less';
import React, {Component} from 'react';
import _ from 'lodash';
import * as d3 from 'd3';
import {ClassDiagramRender, ClassDiagramGraph} from "d3-uml/src/uml/uml";
import {Relation} from "d3-uml/src/uml/class-diagram-relationship"
import API from '../api'
import {gData, getRadioSelectKeys} from "./util";
import Tree, {TreeNode} from 'rc-tree';
import PropTypes from 'prop-types';

class RadioTree extends React.Component {
    // TODO: expandAll 失效了
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
        this.treeData = props.treeData;

    }

    componentDidMount() {
        this.setState({
            treeData: this.treeData
        })
    }

    componentWillReceiveProps(nextProps) {
        this.treeData = nextProps.treeData;
        this.setState({
            treeData: this.treeData
        })

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
        // this.setState({
        //     checkedKeys: [`0-0-${parseInt(Math.random() * 3, 10)}-key`],
        // });
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
                checkable
                onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                defaultExpandAll
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
            >
                {loop(this.state.treeData)}
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
            tree: []
        };
    }

    processDataAndRelations(data) {
        var classes = data["classes"];
        var relations = data["relations"];

        const groups = [];
        var current_group = {nodes: [], relations: []};
        groups.push(current_group);
        var stop = false;

        var nextRe = relations.slice();
        while (nextRe.length !== 0) {
            var added = false;
            const rs = nextRe.slice();
            rs.forEach(function (v, i) {
                if (current_group.nodes.length === 0) {
                    var k1 = v.fromIdentify,
                        k2 = v.toIdentify;

                    var index = nextRe.indexOf(v);
                    if (index > -1) {
                        nextRe.splice(index, 1);
                    }

                    // if (current_group.relations.indexOf(v) === -1) {
                    if (JSON.stringify(current_group.relations).indexOf(JSON.stringify(v))!==-1) {
                        current_group.relations.push(v);
                    }
                    // }
                    current_group.nodes.push(k1);
                    current_group.nodes.push(k2);
                    added = true;

                } else {

                    var k1 = v.fromIdentify,
                        k2 = v.toIdentify;
                    let find1 = current_group.nodes.indexOf(k1);
                    let find2 = current_group.nodes.indexOf(k2);

                    if (find1 !== -1) {
                        if (JSON.stringify(current_group.relations).indexOf(JSON.stringify(v))!==-1) {
                            current_group.relations.push(v);
                        } else {
                            console.log("error")
                        }
                        if (find2 === -1) {
                            current_group.nodes.push(k2);
                        }
                        added = true;

                        var index = nextRe.indexOf(v);
                        if (index > -1) {
                            nextRe.splice(index, 1);
                        }

                    }

                    if (find2 !== -1) {
                        if (JSON.stringify(current_group.relations).indexOf(JSON.stringify(v))!==-1) {
                            current_group.relations.push(v);
                        } else {
                            console.log("error")
                        }
                        if (find1 === -1) {
                            current_group.nodes.push(k1);
                        }
                        added = true;

                        var index = nextRe.indexOf(v);
                        if (index > -1) {
                            nextRe.splice(index, 1);
                        }
                    }
                }
            });
            if (!added) {
                current_group = {nodes: [], relations: []};
                groups.push(current_group);
            }
        }

        var classes1 = []
        groups.forEach(function (v, i) {
            var col = [];
            classes1.push(col)
           v.relations.forEach(function (v1, i1) {
               classes.forEach(function (v3, i3) {
                   var k1 = v1.fromIdentify,
                       k2 = v1.toIdentify;
                   if (v3.identify === k1 || v3.identify === k2) {
                       if (classes.indexOf(v3) !== -1) {
                            col.push(v3)
                       }
                   }
                })
               })
           })

        console.log(groups);
    }

    renderGraph(data) {

        var g = new ClassDiagramGraph().setGraph({});

        this.processDataAndRelations(data);
        var classes = data["classes"];
        var relations = data["relations"];

        classes.forEach((v, i) => {
            v.classname = v.className;
            v.x = 0;
            v.y = 0;
            v.width = 260;
            v.fold = false;
            // v.foldMethod = true;
            // v.foldAttribute = true;
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

    handleGetFileTree(e) {
        e.preventDefault()
        API.post("github/fileTree").then((res) => {
            this.renderFileTree(res.data);

        })
    }

    renderFileTree(data) {
        const holdDict = {};
        const res = [];
        const cacheFind = (h, id) => {
            if (h[id]) {
                return h[id]
            } else {
                h[id] = {};
                return h[id]
            }
        };
        data.fds.forEach((v, i) => {


            const n = cacheFind(holdDict, v.identify);
            n.title = v.name;
            n.key = v.identify;

            if (v.parent) {
                const parentN = cacheFind(holdDict, v.parent);
                if (!parentN.children) {
                    parentN.children = []
                }
                parentN.children.push(n)
            } else {
                res.push(n)
            }
        });

        this.setState({
            tree: res
        });
    }


    handleRepoChange(e) {
        this.setState({repo: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        API.post('github/project', {
            "url": this.state.repo
        }).then(res => {
        });
    }

    handleGetDiagram(e) {
        e.preventDefault()
        API.post('github').then(res => {
            this.renderGraph(res.data);
        });
    }

    handleGetDiagramFromCheckFiles(e) {
        e.preventDefault()
        API.post('/github/diagram/files', {"identifies": this.checkedKeys}).then(res => {
            this.renderGraph(res.data)
        })

    }

    componentDidMount() {

    }

    onCheckKeys(checkedKeys) {
        this.checkedKeys = checkedKeys;
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
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input name="repo" value={this.state.repo} onChange={this.handleRepoChange}/>
                    <button type="submit">Submit repo</button>
                </form>

                <form onSubmit={(e) => this.handleGetDiagram(e)}>
                    <button type="submit">Submit Get Diagram</button>
                </form>

                <form onSubmit={(e) => this.handleGetFileTree(e)}>
                    <button type="submit">Submit Get File Tree</button>
                </form>

                <form onSubmit={(e) => this.handleGetDiagramFromCheckFiles(e)}>
                    <button type="submit">Submit Get Diagram From Check Files</button>
                </form>

                <RadioTree treeData={this.state.tree ? this.state.tree : []} style={treeStyle}
                           onCheckKeys={(k) => {
                               this.onCheckKeys(k)
                           }}/>
                <svg className="svg" style={svgStyle} ref={(r) => this.chartRef = r}/>
            </div>
        );
    }
}

export default ClassDiagramViewDynamic;