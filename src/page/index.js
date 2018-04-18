import React from "react";
import {HashRouter, Route, Link} from 'react-router-dom';

import App from '../app/App'
import Chart from "../chart/Chart";
import ForceDirectedTree from "../force-directed-tree/ForceDirectedTree";
import ClassDiagramView from "../classDiagram/ClassDiagramView";
import ClassDiagramViewDynamic from "../classDiagramDynamic/ClassDiagramViewDynamic";

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <HashRouter>
                <div>
                    <div>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/chart">chart</Link>
                            </li>
                            <li>
                                <Link to="/tree">tree</Link>
                            </li>
                            <li>
                                <Link to="/classDiagram">Class diagram</Link>
                            </li>
                            <li>
                                <Link to="/classDiagramDynamic">Class diagram</Link>
                            </li>
                        </ul>

                        <hr/>
                    </div>
                    <Route path="/" component={App}/>
                    <Route path="/chart" component={Chart}/>
                    <Route path="/tree" component={ForceDirectedTree}/>
                    <Route path="/classDiagram" component={ClassDiagramView}/>
                    <Route path="/classDiagramDynamic" component={ClassDiagramViewDynamic}/>

                </div>
            </HashRouter>
        );
    }
}
