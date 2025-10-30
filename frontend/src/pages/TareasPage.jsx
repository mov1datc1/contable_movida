import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import Badge from '../components/Badge.jsx';
import Alert from '../components/Alert.jsx';
import {
  fetchTareas,
  createTarea,
  updateTarea,
  deleteTarea
} from '../services/tareas.js';

const estatusOptions = [
  { value: 'abierta', label: 'Abierta' },
  { value: 'en_curso', label: 'En curso' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'cerrada', label: 'Cerrada' }
];

const TareasPage = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [estatus, setEstatus] = useState('abierta');
  const [search, setSearch] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('');
  const [alert, setAlert] = useState(null);

  const obtenerTareas = async () => {
    setLoading(true);
    try {
      const data = await fetchTareas();
      setTareas(data);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  const filteredTareas = useMemo(() => {
    return tareas.filter((tarea) => {
      const matchesSearch = tarea.descripcion.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filtroEstatus ? tarea.estatus === filtroEstatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [tareas, search, filtroEstatus]);

  const resetForm = () => {
    setDescripcion('');
    setEstatus('abierta');
    setSelected(null);
  };

  const openModal = (tarea = null) => {
    if (tarea) {
      setSelected(tarea);
      setDescripcion(tarea.descripcion);
      setEstatus(tarea.estatus);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selected) {
        await updateTarea(selected.id_tarea, { descripcion, estatus });
      } else {
        await createTarea({ descripcion, estatus });
      }
      closeModal();
      obtenerTareas();
      setAlert({ type: 'success', message: 'Tarea guardada correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (tarea) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar esta tarea?');
    if (!confirmed) return;
    try {
      await deleteTarea(tarea.id_tarea);
      obtenerTareas();
      setAlert({ type: 'success', message: 'Tarea eliminada correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const columns = [
    {
      key: 'id_tarea',
      header: 'ID Tarea',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.id_tarea}</span>,
      exportValue: (row) => row.id_tarea
    },
    {
      key: 'descripcion',
      header: 'Descripción'
    },
    {
      key: 'estatus',
      header: 'Estatus',
      render: (row) => <Badge variant={row.estatus}>{row.estatus.replace('_', ' ')}</Badge>,
      exportValue: (row) => row.estatus
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tareas"
        description="Gestiona el backlog operativo vinculado al flujo financiero"
        actions={
          <button
            onClick={() => openModal()}
            className="rounded-xl bg-primario-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primario-600"
          >
            Nueva Tarea
          </button>
        }
      />

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <DataTable
        columns={columns}
        data={filteredTareas}
        loading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
        filters={
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primario-400 focus:outline-none focus:ring-2 focus:ring-primario-100"
            />
            <select
              value={filtroEstatus}
              onChange={(e) => setFiltroEstatus(e.target.value)}
              className="w-full md:w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primario-400 focus:outline-none focus:ring-2 focus:ring-primario-100"
            >
              <option value="">Todos los estatus</option>
              {estatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={selected ? 'Editar Tarea' : 'Nueva Tarea'}
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
              className="rounded-lg bg-primario-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primario-600"
            >
              Guardar
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="descripcion"
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            placeholder="Describe la tarea"
          />
          <Select
            id="estatus"
            label="Estatus"
            value={estatus}
            onChange={(e) => setEstatus(e.target.value)}
            options={estatusOptions}
          />
        </form>
      </Modal>
    </div>
  );
};

export default TareasPage;
