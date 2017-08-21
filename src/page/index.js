import React from "react";
import { HashRouter, Route } from 'react-router-dom';

import App from '../app/App'
import Chart from "../chart/Chart";

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
        </div>
      </HashRouter>
    );
  }
}
