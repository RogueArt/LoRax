import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// import App from './components/App';
import Header from './components/Header';
import ManageNodesPage from './pages/ManageNodes/ManageNodesPage';
import ConnectANodePage from './pages/ConnectANode/ConnectANodePage'
import InfoPage from './pages/InfoPage/InfoPage'
import Stack from "./navigation/stack";

ReactDOM.render(
  <React.StrictMode>
    <Stack />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
