// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import { ReactRadarChart } from 'd3-radarchart';

const axisConfig = [
  {label: 'Index A', axisId: "con_1", axisValueMax: 4, axisValueMin: 2},
  {label: 'Index B', axisId: "neu_2", axisValueMax: 1, axisValueMin: 0},
  {label: 'Index C', axisId: "spac_3", axisValueMax: 1, axisValueMin: 0},
  {label: 'Index D', axisId: "open_2", axisValueMax: 1, axisValueMin: 0},
  {label: 'Index E', axisId: "extra_3", axisValueMax: 1, axisValueMin: 0}
];

const data = [
  {
    label: 'Test',
    seriesId: 'nor_1',
    dragEnabled: true,
    showCircle: true,
    circleHighlight: true,
    fill: 'royalblue',
    data: [
      {axis: "con_1", value: 3.8},
      {axis: "neu_2", value: 0.1},
      {axis: "spac_3", value: 0.7},
      {axis: "open_2", value: 0.6},
      {axis: "extra_3", value: 0.5}
    ]
  }
]

const options = {
  chartRootName: 'example',
  data,
  dims: {
    width: 550,
    height: 500,
  },
  showLegend: false,
  rootElementId: 'chart',
  axisConfig
};

const rootNode = document.querySelector('#root');
rootNode && ReactDOM.render(
  <ReactRadarChart
    rootElementProps={{ className: 'chartRootClass' }}
    {...options} />,
  rootNode);