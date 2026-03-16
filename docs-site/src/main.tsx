import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

// Token and component CSS — imported through Vite's alias system
import 'flintwork-dist/tokens/tokens.css';
import 'flintwork-dist/styled/button.css';
import 'flintwork-dist/styled/dialog.css';
import 'flintwork-dist/styled/tabs.css';

// Docs site styles
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);