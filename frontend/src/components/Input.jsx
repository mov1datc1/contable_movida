const Input = ({ label, id, error, className = '', ...props }) => {
  return (
    <label className={`flex w-full flex-col gap-1 text-sm text-slate-600 ${className}`} htmlFor={id}>
      <span className="font-medium text-slate-700">{label}</span>
      <input
        id={id}
        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 shadow-sm focus:border-primario-400 focus:outline-none focus:ring-2 focus:ring-primario-100"
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
};

export default Input;
