import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import DestinationPage from './pages/DestinationPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import MediaPage from './pages/MediaPage';
import WhatsNewPage from './pages/WhatsNewPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations/:id" element={<DestinationPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/whats-new" element={<WhatsNewPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
