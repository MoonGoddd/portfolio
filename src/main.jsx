import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import './styles/index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
