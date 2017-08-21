import React from 'react';
import ReactDOM from 'react-dom';
import './app/index.css';
import Page from './page';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((<div>
    <Page />
  </div>
), document.getElementById('root'));
registerServiceWorker();