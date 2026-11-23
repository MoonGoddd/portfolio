import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import './cv.css';
import CV from './CV.jsx';

createRoot(document.getElementById('cv')).render(
  <React.StrictMode>
    <CV />
  </React.StrictMode>,
);
