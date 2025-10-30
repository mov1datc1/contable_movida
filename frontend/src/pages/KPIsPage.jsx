import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Alert from '../components/Alert.jsx';
import { fetchKPIs } from '../services/resumen.js';

const years = Array.from({ length: 5 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return { value: year.toString(), label: year.toString() };
});

const months = [
  { value: '', label: 'Todo el año' },
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' }
];

const formatCurrency = (value) =>
  value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const KPIsPage = () => {
  const now = new Date();
  const [anio, setAnio] = useState(now.getFullYear().toString());
  const [mes, setMes] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const obtenerKPIs = async () => {
    setLoading(true);
    try {
      const params = { anio };
      if (mes) params.mes = mes;
      const response = await fetchKPIs(params);
      setData(response);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerKPIs();
  }, [anio, mes]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="KPIs Financieros"
        description="Indicadores clave de salud financiera"
        actions={
          <div className="flex gap-2">
            <select
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primario-400 focus:outline-none focus:ring-2 focus:ring-primario-100"
            >
              {years.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primario-400 focus:outline-none focus:ring-2 focus:ring-primario-100"
            >
              {months.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              title="Margen"
              value={`${(data.margen * 100).toFixed(1)}%`}
              subtitle="(Ingresos - Egresos) / Ingresos"
            />
            <Card
              title="Balance acumulado"
              value={formatCurrency(data.balance)}
              subtitle="Resultado del período filtrado"
            />
            <Card
              title="Burn rate mensual"
              value={formatCurrency(data.burnRateMensual)}
              subtitle="Promedio de egresos últimos meses"
            />
            <Card
              title="Tendencia reciente"
              value={
                data.tendenciaCaja.length > 0
                  ? formatCurrency(data.tendenciaCaja[data.tendenciaCaja.length - 1].balance)
                  : 'Sin datos'
              }
              subtitle="Balance del mes más reciente"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-slate-800">Tendencia de caja</h2>
              {loading ? (
                <p className="text-sm text-slate-500">Cargando...</p>
              ) : data.tendenciaCaja.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">Agrega datos históricos para ver la tendencia.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.tendenciaCaja.map((item) => (
                    <li
                      key={`${item.anio}-${item.mes}`}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-600">
                        {item.mes.toString().padStart(2, '0')}/{item.anio}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {formatCurrency(item.balance)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-slate-800">Distribución de egresos</h2>
              {loading ? (
                <p className="text-sm text-slate-500">Cargando...</p>
              ) : data.distribucionEgresos.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">Sin egresos registrados para el filtro actual.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.distribucionEgresos.map((item) => (
                    <li key={item.categoria} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 capitalize">{item.categoria.replace('_', ' ')}</span>
                      <span className="text-sm font-semibold text-slate-700">{item.porcentaje.toFixed(1)}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KPIsPage;
