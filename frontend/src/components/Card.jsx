const Card = ({ title, value, subtitle, icon, accent = 'bg-primario-500' }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md border border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {icon && <div className={`h-12 w-12 rounded-full ${accent} bg-opacity-10 flex items-center justify-center`}>{icon}</div>}
      </div>
    </div>
  );
};

export default Card;
