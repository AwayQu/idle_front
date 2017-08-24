import React from "react";
import {HashRouter, Route} from 'react-router-dom';

import App from '../app/App'
import Chart from "../chart/Chart";
import ForceDirectedTree from "../force-directed-tree/ForceDirectedTree";

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Route path="/" component={App}/>
          <Route path="/chart" component={Chart}/>
          <Route path="/tree" component={ForceDirectedTree}/>
        </div>
      </HashRouter>
    );
  }
}
