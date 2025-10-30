const DataTable = ({
  columns,
  data,
  filters,
  loading = false,
  onEdit,
  onDelete,
  emptyMessage = 'Sin registros disponibles'
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-md">
      {filters && <div className="border-b border-slate-200 px-6 py-4">{filters}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading && (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-6 text-center text-slate-500">
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-6 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!loading &&
              data.map((row) => (
                <tr key={row.id_tarea || row.id_mov || row._id} className="hover:bg-slate-50/70">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-slate-600">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="rounded-lg border border-primario-200 px-3 py-1 text-primario-600 hover:bg-primario-50"
                          >
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="rounded-lg border border-red-200 px-3 py-1 text-red-500 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
