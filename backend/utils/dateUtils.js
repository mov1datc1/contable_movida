export const getDateRangeFromQuery = ({ inicio, fin, anio, mes }) => {
  let startDate;
  let endDate;

  if (inicio && fin) {
    startDate = new Date(inicio);
    endDate = new Date(fin);
    endDate.setHours(23, 59, 59, 999);
    return { startDate, endDate };
  }

  if (anio) {
    const year = parseInt(anio, 10);
    if (mes) {
      const month = parseInt(mes, 10) - 1;
      startDate = new Date(Date.UTC(year, month, 1));
      endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    } else {
      startDate = new Date(Date.UTC(year, 0, 1));
      endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
    }
  }

  return { startDate, endDate };
};

export const getPreviousMonthRange = (anio, mes) => {
  if (!anio || !mes) return {};
  const year = parseInt(anio, 10);
  const monthIndex = parseInt(mes, 10) - 1;
  const prev = new Date(Date.UTC(year, monthIndex, 1));
  prev.setUTCMonth(prev.getUTCMonth() - 1);
  const startDate = new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth(), 1));
  const endDate = new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  return { startDate, endDate };
};
