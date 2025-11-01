import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import Alert from '../components/Alert.jsx';
import { fetchEstadoResultados } from '../services/resumen.js';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, index) => {
  const year = currentYear + 2 - index;
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

const monthNames = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre'
};

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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              title="Ingresos operativos"
              value={formatCurrency(resumen.ingresosOperativos ?? 0)}
              subtitle="Ventas y servicios del negocio"
            />
            <Card
              title="Utilidad Bruta"
              value={formatCurrency(resumen.utilidadBruta ?? 0)}
              subtitle="Ingresos menos costo directo"
            />
            <Card
              title="EBITDA"
              value={formatCurrency(resumen.ebitda ?? 0)}
              subtitle="Utilidad antes de depreciación"
            />
            <Card
              title="Utilidad / pérdida neta"
              value={formatCurrency(resumen.utilidadNeta ?? 0)}
              subtitle={(resumen.utilidadNeta ?? 0) >= 0 ? 'Resultado positivo' : 'Resultado negativo'}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Estado de resultados</h2>
                  <p className="text-sm text-slate-500">
                    Periodo:{' '}
                    {resumen.periodo?.anio
                      ? resumen.periodo?.mes
                        ? `${
                            monthNames[resumen.periodo.mes] || `Mes ${resumen.periodo.mes}`
                          } ${resumen.periodo.anio}`
                        : `Año ${resumen.periodo.anio}`
                      : 'Sin filtro específico'}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-600">
                  Otros ingresos: {formatCurrency(resumen.otrosIngresos ?? 0)}
                </p>
              </div>

              <div className="mt-6 space-y-2">
                {[
                  {
                    label: 'Ingresos operativos',
                    value: resumen.ingresosOperativos,
                    variant: 'header'
                  },
                  {
                    label: 'Costo directo',
                    value: resumen.costoDirecto,
                    variant: 'negative'
                  },
                  {
                    label: 'Utilidad Bruta',
                    value: resumen.utilidadBruta,
                    variant: 'subtotal'
                  },
                  {
                    label: 'Gastos operativos',
                    value: resumen.gastosOperativosTotales,
                    variant: 'negative'
                  },
                  {
                    label: 'EBITDA',
                    value: resumen.ebitda,
                    variant: 'subtotal'
                  },
                  {
                    label: 'Depreciación y amortización',
                    value: resumen.depreciacionYAmortizacion,
                    variant: 'negative'
                  },
                  {
                    label: 'Utilidad operativa',
                    value: resumen.utilidadOperativa,
                    variant: 'subtotal'
                  },
                  {
                    label: 'Otros ingresos',
                    value: resumen.otrosIngresos,
                    variant: 'positive'
                  },
                  {
                    label: 'Otros egresos',
                    value: resumen.otrosEgresos,
                    variant: 'negative'
                  },
                  {
                    label: 'Utilidad antes de impuestos',
                    value: resumen.utilidadAntesImpuestos,
                    variant: 'subtotal'
                  },
                  {
                    label: 'Impuestos del periodo',
                    value: resumen.impuestosPeriodo,
                    variant: 'negative'
                  },
                  {
                    label: 'Utilidad / pérdida neta',
                    value: resumen.utilidadNeta,
                    variant: 'final'
                  }
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm sm:text-base ${
                      row.variant === 'header'
                        ? 'bg-slate-100 font-semibold text-slate-700'
                        : row.variant === 'subtotal'
                        ? 'bg-white font-semibold text-slate-800'
                        : row.variant === 'final'
                        ? 'bg-primario-50 font-semibold text-primario-700'
                        : 'bg-white text-slate-600'
                    }`}
                  >
                    <span>{row.variant === 'final' ? '= ' : row.variant === 'negative' ? '- ' : row.variant === 'positive' ? '+ ' : ''}{row.label}</span>
                    <span className="font-medium">{formatCurrency(row.value || 0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
                <h2 className="text-lg font-semibold text-slate-800">Ingresos por categoría operativa</h2>
                {loading ? (
                  <p className="text-sm text-slate-500">Cargando...</p>
                ) : resumen.ingresosOperativosPorCategoria.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">Sin datos de ingresos operativos</p>
                ) : (
                  <table className="mt-4 min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-500">Categoría</th>
                        <th className="px-4 py-2 text-right font-semibold text-slate-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {resumen.ingresosOperativosPorCategoria.map((item) => (
                        <tr key={item.categoria}>
                          <td className="px-4 py-3 text-slate-600">{item.categoria}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-700">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-700">Otros ingresos</h3>
                  {resumen.otrosIngresosPorCategoria.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-400">Sin datos de otros ingresos</p>
                  ) : (
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {resumen.otrosIngresosPorCategoria.map((item) => (
                        <li key={item.categoria} className="flex justify-between">
                          <span>{item.categoria}</span>
                          <span className="font-medium text-slate-700">{formatCurrency(item.total)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
                <h2 className="text-lg font-semibold text-slate-800">Gastos operativos por categoría</h2>
                {loading ? (
                  <p className="text-sm text-slate-500">Cargando...</p>
                ) : resumen.gastosOperativosPorCategoria.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">Sin datos de gastos operativos</p>
                ) : (
                  <table className="mt-4 min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-500">Categoría</th>
                        <th className="px-4 py-2 text-right font-semibold text-slate-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {resumen.gastosOperativosPorCategoria.map((item) => (
                        <tr key={item.categoria}>
                          <td className="px-4 py-3 text-slate-600">{item.categoria}</td>
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
          </div>
        </>
      )}
    </div>
  );
};

export default EstadoResultadosPage;
