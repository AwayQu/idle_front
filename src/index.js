import React from 'react';
import ReactDOM from 'react-dom';
import './app/index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((<div>
    <App />
  </div>
), document.getElementById('root'));
registerServiceWorker();