import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// import './output.css'; // Removed to use CDN
// import './index.css';  // Removed to use CDN
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
