import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import TareasPage from './pages/TareasPage.jsx';
import MovimientosPage from './pages/MovimientosPage.jsx';
import FlujoCajaPage from './pages/FlujoCajaPage.jsx';
import EstadoResultadosPage from './pages/EstadoResultadosPage.jsx';
import KPIsPage from './pages/KPIsPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/flujo-caja" replace />} />
        <Route path="tareas" element={<TareasPage />} />
        <Route path="reportes" element={<MovimientosPage />} />
        <Route path="flujo-caja" element={<FlujoCajaPage />} />
        <Route path="estado-resultados" element={<EstadoResultadosPage />} />
        <Route path="kpis" element={<KPIsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
