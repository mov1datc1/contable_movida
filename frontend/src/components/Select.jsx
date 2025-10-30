const Select = ({ label, id, options, error, className = '', ...props }) => {
  return (
    <label className={`flex w-full flex-col gap-1 text-sm text-slate-600 ${className}`} htmlFor={id}>
      <span className="font-medium text-slate-700">{label}</span>
      <select
        id={id}
        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 shadow-sm focus:border-primario-400 focus:outline-none focus:ring-2 focus:ring-primario-100"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
};

export default Select;
