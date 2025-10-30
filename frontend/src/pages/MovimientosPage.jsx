import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import DateInput from '../components/DateInput.jsx';
import Badge from '../components/Badge.jsx';
import Alert from '../components/Alert.jsx';
import {
  fetchMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento
} from '../services/movimientos.js';
import { exportToExcel, exportToPDF } from '../utils/exporters.js';

const origenes = [
  'BBVA Movida',
  'BBVA Jonathan',
  'BOFA Jonathan',
  'WellsFargo Ricardo',
  'Efectivo',
  'PayPal Movida',
  'Stripe Movida',
  'Wise Movida',
  'Otro'
];

const tipoFlujos = [
  { value: 'operativo', label: 'Operativo' },
  { value: 'inversion', label: 'Inversión' },
  { value: 'financiamiento', label: 'Financiamiento' }
];

const categoriasIngreso = [
  { value: 'ventas', label: 'Ventas' },
  { value: 'aportacion_capital', label: 'Aportación de capital' },
  { value: 'intereses', label: 'Intereses' },
  { value: 'otros', label: 'Otros' }
];

const categoriasEgreso = [
  { value: 'nomina', label: 'Nómina' },
  { value: 'renta', label: 'Renta' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'publicidad', label: 'Publicidad' },
  { value: 'materiales', label: 'Materiales' },
  { value: 'impuestos', label: 'Impuestos' },
  { value: 'otro', label: 'Otro' }
];

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sentidoModal, setSentidoModal] = useState('ingreso');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    fecha: '',
    descripcion: '',
    monto: '',
    tipoFlujo: 'operativo',
    categoriaIngreso: 'ventas',
    categoriaEgreso: 'nomina',
    origen: 'BBVA Movida'
  });
  const [search, setSearch] = useState('');
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [mes, setMes] = useState('');
  const [sentidoFiltro, setSentidoFiltro] = useState('');
  const [alert, setAlert] = useState(null);

  const obtenerMovimientos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (sentidoFiltro) params.sentido = sentidoFiltro;
      const data = await fetchMovimientos(params);
      setMovimientos(data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
  }, [anio, mes, sentidoFiltro]);

  const filteredMovimientos = useMemo(() => {
    return movimientos.filter((mov) =>
      mov.descripcion.toLowerCase().includes(search.toLowerCase())
    );
  }, [movimientos, search]);

  const openModal = (sentido, movimiento = null) => {
    setSentidoModal(sentido);
    if (movimiento) {
      setSelected(movimiento);
      setForm({
        fecha: movimiento.fecha ? movimiento.fecha.slice(0, 10) : '',
        descripcion: movimiento.descripcion,
        monto: movimiento.monto,
        tipoFlujo: movimiento.tipoFlujo,
        categoriaIngreso: movimiento.categoriaIngreso || 'ventas',
        categoriaEgreso: movimiento.categoriaEgreso || 'nomina',
        origen: movimiento.origen
      });
    } else {
      setSelected(null);
      setForm({
        fecha: new Date().toISOString().slice(0, 10),
        descripcion: '',
        monto: '',
        tipoFlujo: 'operativo',
        categoriaIngreso: 'ventas',
        categoriaEgreso: 'nomina',
        origen: 'BBVA Movida'
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      monto: Number(form.monto),
      fecha: form.fecha,
      sentido: sentidoModal
    };
    if (sentidoModal === 'ingreso') {
      payload.categoriaEgreso = '';
    } else {
      payload.categoriaIngreso = '';
    }

    try {
      if (selected) {
        await updateMovimiento(selected.id_mov, payload);
      } else {
        await createMovimiento(payload);
      }
      closeModal();
      obtenerMovimientos();
      setAlert({ type: 'success', message: 'Movimiento guardado correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (movimiento) => {
    const confirmed = window.confirm('¿Eliminar este movimiento?');
    if (!confirmed) return;
    try {
      await deleteMovimiento(movimiento.id_mov);
      obtenerMovimientos();
      setAlert({ type: 'success', message: 'Movimiento eliminado' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const columns = [
    {
      key: 'id_mov',
      header: 'ID Mov',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.id_mov}</span>,
      exportValue: (row) => row.id_mov
    },
    {
      key: 'fecha',
      header: 'Fecha',
      render: (row) => new Date(row.fecha).toLocaleDateString('es-MX'),
      exportValue: (row) => new Date(row.fecha).toLocaleDateString('es-MX')
    },
    {
      key: 'descripcion',
      header: 'Descripción'
    },
    {
      key: 'monto',
      header: 'Monto (MXN)',
      render: (row) => row.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
      exportValue: (row) => row.monto
    },
    {
      key: 'sentido',
      header: 'Sentido',
      render: (row) => <Badge variant={row.sentido}>{row.sentido}</Badge>,
      exportValue: (row) => row.sentido
    },
    {
      key: 'tipoFlujo',
      header: 'Tipo de flujo',
      render: (row) => row.tipoFlujo
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (row) => (row.sentido === 'ingreso' ? row.categoriaIngreso : row.categoriaEgreso),
      exportValue: (row) => (row.sentido === 'ingreso' ? row.categoriaIngreso : row.categoriaEgreso)
    },
    {
      key: 'origen',
      header: 'Origen'
    }
  ];

  const exportColumns = columns;

  const years = Array.from({ length: 5 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return { value: year.toString(), label: year.toString() };
  });

  const months = [
    { value: '', label: 'Todos los meses' },
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes de Movimientos"
        description="Control centralizado de ingresos y egresos"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => openModal('ingreso')}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600"
            >
              Nuevo Ingreso
            </button>
            <button
              onClick={() => openModal('egreso')}
              className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-rose-600"
            >
              Nuevo Egreso
            </button>
            <button
              onClick={() => exportToExcel('movimientos', exportColumns, filteredMovimientos)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Exportar Excel
            </button>
            <button
              onClick={() => exportToPDF('movimientos', exportColumns, filteredMovimientos)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Exportar PDF
            </button>
          </div>
        }
      />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <DataTable
        columns={columns}
        data={filteredMovimientos}
        loading={loading}
        onEdit={(row) => openModal(row.sentido, row)}
        onDelete={handleDelete}
        filters={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
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
              <div className="flex gap-2">
                {['', 'ingreso', 'egreso'].map((value) => (
                  <button
                    key={value || 'todos'}
                    onClick={() => setSentidoFiltro(value)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-sm transition ${
                      sentidoFiltro === value
                        ? 'bg-primario-500 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {value === '' ? 'Todos' : value}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Buscar descripción"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primario-400 focus:outline-none focus:ring-2 focus:ring-primario-100"
            />
          </div>
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={`${selected ? 'Editar' : 'Nuevo'} ${sentidoModal === 'ingreso' ? 'Ingreso' : 'Egreso'}`}
        footer={
          <>
            <button
              onClick={closeModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className={`${
                sentidoModal === 'ingreso'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-rose-500 hover:bg-rose-600'
              } rounded-lg px-4 py-2 text-sm font-semibold text-white`}
            >
              Guardar
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DateInput
            id="fecha"
            label="Fecha"
            value={form.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            required
          />
          <Input
            id="descripcion"
            label="Descripción"
            value={form.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            required
            placeholder="Describe el movimiento"
          />
          <Input
            id="monto"
            label="Monto"
            type="number"
            min="0"
            step="0.01"
            value={form.monto}
            onChange={(e) => handleChange('monto', e.target.value)}
            required
          />
          <Select
            id="tipoFlujo"
            label="Tipo de flujo"
            value={form.tipoFlujo}
            onChange={(e) => handleChange('tipoFlujo', e.target.value)}
            options={tipoFlujos}
          />
          {sentidoModal === 'ingreso' ? (
            <Select
              id="categoriaIngreso"
              label="Categoría de ingreso"
              value={form.categoriaIngreso}
              onChange={(e) => handleChange('categoriaIngreso', e.target.value)}
              options={categoriasIngreso}
            />
          ) : (
            <Select
              id="categoriaEgreso"
              label="Categoría de egreso"
              value={form.categoriaEgreso}
              onChange={(e) => handleChange('categoriaEgreso', e.target.value)}
              options={categoriasEgreso}
            />
          )}
          <Select
            id="origen"
            label="Origen"
            value={form.origen}
            onChange={(e) => handleChange('origen', e.target.value)}
            options={origenes.map((origen) => ({ value: origen, label: origen }))}
          />
        </form>
      </Modal>
    </div>
  );
};

export default MovimientosPage;
