import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

import './styles/tokens/tokens.css';
import './styles/styled/accordion.css';
import './styles/styled/button.css';
import './styles/styled/dialog.css';
import './styles/styled/menu.css';
import './styles/styled/popover.css';
import './styles/styled/select.css';
import './styles/styled/tabs.css';
import './styles/styled/tooltip.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
