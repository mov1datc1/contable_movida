const Alert = ({ type = 'error', message, onClose }) => {
  const colors = {
    error: 'bg-red-50 text-red-600 border border-red-200',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    info: 'bg-sky-50 text-sky-600 border border-sky-200'
  };

  if (!message) return null;

  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${colors[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-xs font-semibold uppercase">
          Cerrar
        </button>
      )}
    </div>
  );
};

export default Alert;
