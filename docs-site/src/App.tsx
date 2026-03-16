import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Tokens } from './pages/Tokens';
import { ButtonPage } from './pages/ButtonPage';
import { DialogPage } from './pages/DialogPage';
import { TabsPage } from './pages/TabsPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/dialog" element={<DialogPage />} />
        <Route path="/components/tabs" element={<TabsPage />} />
      </Routes>
    </Layout>
  );
}
