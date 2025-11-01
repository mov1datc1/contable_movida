const Card = ({
  title,
  value,
  subtitle,
  icon,
  accent = 'bg-primario-500',
  background = 'bg-white',
  valueColor = 'text-slate-900',
  titleColor = 'text-slate-400',
  subtitleColor = 'text-slate-500'
}) => {
  return (
    <div className={`rounded-xl border border-slate-100 p-6 shadow-md ${background}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm uppercase tracking-wide ${titleColor}`}>{title}</p>
          <p className={`mt-2 text-3xl font-semibold ${valueColor}`}>{value}</p>
          {subtitle && <p className={`mt-1 text-sm ${subtitleColor}`}>{subtitle}</p>}
        </div>
        {icon && <div className={`flex h-12 w-12 items-center justify-center rounded-full ${accent} bg-opacity-10`}>{icon}</div>}
      </div>
    </div>
  );
};

export default Card;
