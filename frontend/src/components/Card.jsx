const Card = ({
  title,
  value,
  subtitle,
  icon,
  accent = 'bg-white/20 text-white',
  background = 'bg-gradient-to-br from-primario-500 via-primario-400 to-primario-600 text-white',
  valueColor = 'text-white',
  titleColor = 'text-primario-100',
  subtitleColor = 'text-primario-50/90',
  borderColor = 'border-white/10',
  className = ''
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${borderColor} p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${background} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:backdrop-blur-sm" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${titleColor}`}>{title}</p>
          <p className={`mt-3 text-3xl font-semibold ${valueColor}`}>{value}</p>
          {subtitle && <p className={`mt-2 text-sm ${subtitleColor}`}>{subtitle}</p>}
        </div>
        {icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${accent}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
