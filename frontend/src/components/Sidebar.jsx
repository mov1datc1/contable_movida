import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  CheckCircleIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Flujo de Caja', to: '/flujo-caja', icon: Squares2X2Icon },
  { name: 'Tareas', to: '/tareas', icon: CheckCircleIcon },
  { name: 'Reportes', to: '/reportes', icon: ChartBarIcon },
  { name: 'Estados de Resultado', to: '/estado-resultados', icon: DocumentChartBarIcon },
  { name: 'KPIs Financieros', to: '/kpis', icon: SparklesIcon }
];

const Sidebar = () => {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-6 py-8 border-b border-slate-100">
        <div className="text-2xl font-bold text-primario-600">Contabilidad Movida</div>
        <p className="mt-2 text-sm text-slate-500">Panel financiero integrado</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primario-50 text-primario-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="px-6 py-6 border-t border-slate-100 text-xs text-slate-400">
        © {new Date().getFullYear()} Movida TCI
      </div>
    </aside>
  );
};

export default Sidebar;
