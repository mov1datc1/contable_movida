import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Alert from '../components/Alert.jsx';
import { fetchEstadoResultados } from '../services/resumen.js';

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

const EstadoResultadosPage = () => {
  const now = new Date();
  const [anio, setAnio] = useState(now.getFullYear().toString());
  const [mes, setMes] = useState('');
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const obtenerResumen = async () => {
    setLoading(true);
    try {
      const params = { anio };
      if (mes) params.mes = mes;
      const data = await fetchEstadoResultados(params);
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
        title="Estados de Resultado"
        description="Resumen financiero con clasificación contable"
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
          <div className="grid gap-4 md:grid-cols-3">
            <Card
              title="Ingresos totales"
              value={formatCurrency(resumen.ingresosTotales)}
              subtitle="Ventas y otras entradas"
            />
            <Card
              title="Egresos operativos"
              value={formatCurrency(resumen.egresosOperativos)}
              subtitle="Costos necesarios para operar"
            />
            <Card
              title="Utilidad / pérdida neta"
              value={formatCurrency(resumen.utilidadNeta)}
              subtitle={resumen.utilidadNeta >= 0 ? 'Resultado positivo' : 'Resultado negativo'}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-slate-800">Ingresos por categoría</h2>
              {loading ? (
                <p className="text-sm text-slate-500">Cargando...</p>
              ) : (
                <table className="mt-4 min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-500">Categoría</th>
                      <th className="px-4 py-2 text-right font-semibold text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {resumen.detalle.ingresos.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-center text-slate-400">
                          Sin datos de ingresos
                        </td>
                      </tr>
                    )}
                    {resumen.detalle.ingresos.map((item) => (
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
              <h2 className="text-lg font-semibold text-slate-800">Egresos por categoría</h2>
              {loading ? (
                <p className="text-sm text-slate-500">Cargando...</p>
              ) : (
                <table className="mt-4 min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-500">Categoría</th>
                      <th className="px-4 py-2 text-right font-semibold text-slate-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {resumen.detalle.egresos.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-center text-slate-400">
                          Sin datos de egresos
                        </td>
                      </tr>
                    )}
                    {resumen.detalle.egresos.map((item) => (
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

export default EstadoResultadosPage;
