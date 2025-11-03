import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Alert from '../components/Alert.jsx';
import { fetchFlujoCaja } from '../services/resumen.js';

const years = Array.from({ length: 5 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return { value: year.toString(), label: year.toString() };
});

const months = [
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

const FlujoCajaPage = () => {
  const now = new Date();
  const [anio, setAnio] = useState(now.getFullYear().toString());
  const [mes, setMes] = useState((now.getMonth() + 1).toString());
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const obtenerResumen = async () => {
    setLoading(true);
    try {
      const data = await fetchFlujoCaja({ anio, mes });
      setResumen(data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerResumen();
  }, [anio, mes]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flujo de Caja"
        description="Visibilidad de caja mensual con comparativos"
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

      {resumen && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              title="Ingresos del período"
              value={formatCurrency(resumen.totalIngresosPeriodo)}
              subtitle="Incluye todas las entradas registradas"
              background="bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600"
              titleColor="text-emerald-100"
              subtitleColor="text-emerald-50/90"
              borderColor="border-emerald-300/40"
            />
            <Card
              title="Egresos del período"
              value={formatCurrency(resumen.totalEgresosPeriodo)}
              subtitle="Suma de gastos operativos y no operativos"
              background="bg-gradient-to-br from-rose-500 via-rose-400 to-rose-600"
              titleColor="text-rose-100"
              subtitleColor="text-rose-50/90"
              borderColor="border-rose-300/40"
            />
            <Card
              title="Balance del período"
              value={formatCurrency(resumen.balancePeriodo)}
              subtitle="Ingresos - Egresos"
              background="bg-gradient-to-br from-sky-500 via-sky-400 to-blue-600"
              titleColor="text-sky-100"
              subtitleColor="text-sky-50/90"
              borderColor="border-sky-300/40"
            />
            <Card
              title="Variación vs mes anterior"
              value={
                resumen.comparativoMesAnterior
                  ? formatCurrency(resumen.comparativoMesAnterior.diferencia)
                  : 'Sin datos'
              }
              subtitle={
                resumen.comparativoMesAnterior
                  ? `Balance anterior: ${formatCurrency(
                      resumen.comparativoMesAnterior.balanceAnterior
                    )}`
                  : 'Agrega más historial para comparar'
              }
              background="bg-gradient-to-br from-fuchsia-500 via-purple-500 to-amber-500"
              titleColor="text-fuchsia-100"
              subtitleColor="text-fuchsia-50/90"
              borderColor="border-fuchsia-300/40"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Detalle de ingresos</h2>
              </div>
              {loading ? (
                <p className="text-sm text-slate-500">Cargando...</p>
              ) : (
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-500">Categoría</th>
                      <th className="px-4 py-2 text-right font-semibold text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {resumen.breakdown.ingresos.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-center text-slate-400">
                          Sin ingresos registrados en el período
                        </td>
                      </tr>
                    )}
                    {resumen.breakdown.ingresos.map((item) => (
                      <tr key={item.categoria}>
                        <td className="px-4 py-3 capitalize text-slate-600">
                          {item.categoria.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Detalle de egresos</h2>
              </div>
              {loading ? (
                <p className="text-sm text-slate-500">Cargando...</p>
              ) : (
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-500">Categoría</th>
                      <th className="px-4 py-2 text-right font-semibold text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {resumen.breakdown.egresos.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-center text-slate-400">
                          Sin egresos registrados en el período
                        </td>
                      </tr>
                    )}
                    {resumen.breakdown.egresos.map((item) => (
                      <tr key={item.categoria}>
                        <td className="px-4 py-3 capitalize text-slate-600">
                          {item.categoria.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlujoCajaPage;
