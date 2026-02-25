import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JazzSheets } from './JazzSheets';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JazzSheets />
  </StrictMode>,
);
