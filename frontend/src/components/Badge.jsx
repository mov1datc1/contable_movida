const badgeStyles = {
  abierta: 'bg-rose-50 text-rose-600 border border-rose-200',
  en_curso: 'bg-amber-50 text-amber-600 border border-amber-200',
  on_hold: 'bg-slate-50 text-slate-500 border border-slate-200',
  cerrada: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  ingreso: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  egreso: 'bg-rose-50 text-rose-600 border border-rose-200'
};

const Badge = ({ children, variant }) => {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize';
  return <span className={`${base} ${badgeStyles[variant] || 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{children}</span>;
};

export default Badge;
