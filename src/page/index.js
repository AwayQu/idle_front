import React from "react";
import {HashRouter, Route, Link} from 'react-router-dom';

import App from '../app/App'
import Chart from "../chart/Chart";
import ForceDirectedTree from "../force-directed-tree/ForceDirectedTree";
import ClassDiagramView from "../classDiagram/ClassDiagramView";
import ClassDiagramViewDynamic from "../classDiagramDynamic/ClassDiagramViewDynamic";
import 'element-theme-default';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const liStyle = {
            float: 'left',
            marginLeft: 20,
        };
        const clearStyle = {
            clear: 'both'
        }
        const hrStyle = {
            marginTop: 10
        };

        return (
            <HashRouter>
                <div>
                    <div>
                        <ul>
                            <li style={liStyle}>
                                <Link to="/home">Home</Link>
                            </li>
                            <li style={liStyle}>
                                <Link to="/">Class diagram</Link>
                            </li>
                            {/*<li style={liStyle}>*/}
                                {/*<Link to="/chart">chart</Link>*/}
                            {/*</li>*/}
                            {/*<li style={liStyle}>*/}
                                {/*<Link to="/tree">tree</Link>*/}
                            {/*</li>*/}
                            {/*<li style={liStyle}>*/}
                                {/*<Link to="/classDiagram">Class diagram</Link>*/}
                            {/*</li>*/}
                        </ul>
                        <div style={clearStyle}></div>

                        <hr style={hrStyle}/>
                    </div>
                    <Route path="/home" component={App}/>
                    <Route path="/" component={ClassDiagramViewDynamic}/>
                    {/*<Route path="/chart" component={Chart}/>*/}
                    {/*<Route path="/tree" component={ForceDirectedTree} a={"sss"}/>*/}
                    {/*<Route path="/classDiagram" component={ClassDiagramView}/>*/}

                </div>
            </HashRouter>
        );
    }
}
