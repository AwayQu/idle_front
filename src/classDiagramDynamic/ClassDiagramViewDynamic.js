import './index.less';
import './ClassDiagramViewDynamic.css';
import React, {Component} from 'react';
import * as d3 from 'd3';
import {ClassDiagramRender, ClassDiagramGraph} from "d3-uml/src/uml/uml";
import {Relation} from "d3-uml/src/uml/class-diagram-relationship"
import API from '../api'

import {Button, ButtonGroup, DropdownButton, MenuItem} from "react-bootstrap";
import RadioTree from "./RadioTree";
import {Message} from "element-react";


class ClassDiagramViewDynamic extends Component {

    diagrams = [];
    i = 0;
    fold = false;

    constructor(props) {
        super(props);
        this.handleRepoChange = this.handleRepoChange.bind(this);
        this.state = {
            showUrlInput: typeof this.props.showUrlInput === 'undefined' ? true : this.props.showUrlInput,
            showFileTree: typeof this.props.showFileTree === 'undefined' ? true : this.props.showFileTree,
            showToolBar: typeof this.props.showToolBar === 'undefined' ? true : this.props.showToolBar,
            diagrams: [],
            repo: "ios_hello",
            tree: [],

        };
    }


    renderGraph(d) {
        var g = new ClassDiagramGraph().setGraph({});

        var classes = d["classes"];
        var relations = d["relations"];

        classes.forEach((v, i) => {
            v.classname = v.className;
            v.x = 0;
            v.y = 0;
            v.width = 260;
            v.fold = this.fold;
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

    getFileTree() {
        API.post("github/fileTree").then((res) => {
            this.renderFileTree(res.data);
            Message.success("获取目录树成功")
        })
    }

    handleGetFileTree(e) {
        e.preventDefault();


        this.getFileTree();
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
        this.fetchRepo();
    }

    fetchRepo() {
        API.post('github/project', {
            "url": this.state.repo
        }).then(res => {
            if (res.data.code === 200) {
                Message.success('提交成功');
                this.getFileTree();
            } else {
                Message.error('提交失败');
            }
        });
    }

    handleShowDiagram(e, i) {
        this.i = i;
        const d = this.diagrams[i];
        this.renderGraph(d)
    }

    handleGetDiagram(e) {
        API.post('github').then(res => {
            this.renderGraph(res.data);
        });
    }

    handleGetDiagramFromCheckFiles(e) {
        API.post('/github/diagram/files', {"identifies": this.checkedKeys}).then(res => {
            this.diagrams = res.data;

            this.setState({diagrams: this.diagrams});

            const data = {
                "classes": this.diagrams[0].classes,
                "relations": this.diagrams[0].relations
            };

            this.renderGraph(data)
        })

    }

    componentDidMount() {
        this.fetchRepo();
    }

    onCheckKeys(checkedKeys) {
        this.checkedKeys = checkedKeys;
        console.log(checkedKeys)
    }

    handleShowHide(e, i) {
        console.log(e);
        if (i === 2) {

            this.setState({showFileTree: !this.state.showFileTree})
        } else if (i === 3) {
            this.setState({showToolBar: !this.state.showToolBar})
        }
    }

    /**
     * 显示合并的数据
     */
    handleShowMerge() {
        // TODO: 显示合并的数据
    }

    handleFold() {
        this.fold = !this.fold;
        this.renderGraph(this.diagrams[this.i]);
    }

    render() {

        const treeStyle = {
            width: '30%',
            display: 'inline-block',
            verticalAlign: "top",
            overflowY: "scroll",
            height: "600px"
            // padding: '0 20px'
        };
        var rightStyle = {
            background: "yellow",
            verticalAlign: "top",
            display: "inline-block",
            width: "70%",
        };
        if (!this.state.showFileTree) {
            rightStyle.width = "100%",
                rightStyle.height = "100%"
        }

        const loop = data => {
            var index = 0;
            return data.map((d) => {
                const i = index;
                index++;
                return <Button key={index.toString()} onClick={(e) => this.handleShowDiagram(e, i)}>{i}</Button>
            });

        };
        return (

            <div>
                <div style={{float: "right"}}>
                    <ButtonGroup>
                        {/*<Button  onClick={(e) => this.handleShowHide(e, 1)}>Show Search</Button>*/}
                        <Button onClick={(e) => this.handleShowHide(e, 2)}>Show File Tree</Button>
                        <Button onClick={(e) => this.handleShowHide(e, 3)}>Show ToolBar</Button>
                    </ButtonGroup>
                </div>
                <div className="inputBox">
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               placeholder="Input project url ..."
                               name="repo"
                               value={this.state.repo} onChange={this.handleRepoChange}
                               type="text"
                               style={{width: "80%", display: "inline"}}/>
                        <Button onClick={(e) => this.handleSubmit(e)} style={{
                            width: "19%",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            float: "right"
                        }}>Submit
                        </Button>
                    </div>
                </div>

                {this.state.showToolBar ?
                    <div style={{width: "30%", marginTop: "10px"}}>
                        <ButtonGroup>
                            <DropdownButton title="Diagrams" id="bg-nested-dropdown">
                                <MenuItem onClick={(e) => this.handleGetDiagram(e)} eventKey="1">Submit Get
                                    Diagram</MenuItem>
                                <MenuItem onClick={(e) => this.handleGetFileTree(e)} eventKey="2">Submit Get File
                                    Tree</MenuItem>
                                <MenuItem onClick={(e) => this.handleGetDiagramFromCheckFiles(e)} eventKey="3">Submit
                                    Get
                                    Diagram From Check Files</MenuItem>
                            </DropdownButton>
                        </ButtonGroup>
                    </div> : ""
                }


                <div style={{height: "700px"}}>
                    {this.state.showFileTree ?
                        <RadioTree treeData={this.state.tree ? this.state.tree : []} style={treeStyle}
                                   onCheckKeys={(k) => {
                                       this.onCheckKeys(k)
                                   }}/> : ""
                    }


                    <div style={rightStyle}>
                        <div style={{float: "right", marginTop: "10px"}}>
                            <ButtonGroup>
                                <Button onClick={(e) => this.handleShowMerge()}>显示合并</Button>
                                <Button onClick={(e) => this.handleFold()}>fold</Button>
                                {loop(this.state.diagrams)}
                            </ButtonGroup>
                        </div>
                        <svg className="svg" ref={(r) => this.chartRef = r}/>
                    </div>

                </div>
            </div>
        );
    }


}

export default ClassDiagramViewDynamic;