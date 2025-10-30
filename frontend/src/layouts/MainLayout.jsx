import Sidebar from '../components/Sidebar.jsx';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-8 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
