import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/';
import GlobalStyle from './components/GlobalStyle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
