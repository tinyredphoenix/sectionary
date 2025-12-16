import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './output.css'; // Re-enabled local CSS import
import { BrowserRouter } from 'react-router-dom';
// Removed: import { DatabaseSeeder } from './components/DatabaseSeeder';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* Removed: <DatabaseSeeder /> */}
  </React.StrictMode>,
)
