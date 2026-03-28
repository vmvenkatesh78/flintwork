import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Tokens } from './pages/Tokens';
import { ButtonPage } from './pages/ButtonPage';
import { DialogPage } from './pages/DialogPage';
import { TabsPage } from './pages/TabsPage';
import { TooltipPage } from './pages/TooltipPage';
import { AccordionPage } from './pages/AccordionPage';
import { PopoverPage } from './pages/PopoverPage';
import { MenuPage } from './pages/MenuPage';
import { SelectPage } from './pages/SelectPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/dialog" element={<DialogPage />} />
        <Route path="/components/tabs" element={<TabsPage />} />
        <Route path="/components/tooltip" element={<TooltipPage />} />
        <Route path="/components/accordion" element={<AccordionPage />} />
        <Route path="/components/popover" element={<PopoverPage />} />
        <Route path="/components/menu" element={<MenuPage />} />
        <Route path="/components/select" element={<SelectPage />} />
      </Routes>
    </Layout>
  );
}
