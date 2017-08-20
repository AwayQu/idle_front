import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Chart from './Chart';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((<div>
  <App />
  <Chart />
</div>
), document.getElementById('root'));
registerServiceWorker();
