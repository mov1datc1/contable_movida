import { Movimiento } from '../models/Movimiento.js';
import { getDateRangeFromQuery, getPreviousMonthRange } from '../utils/dateUtils.js';

const buildMatch = (query) => {
  const { inicio, fin, anio, mes } = query;
  const match = {};
  const { startDate, endDate } = getDateRangeFromQuery({ inicio, fin, anio, mes });
  if (startDate && endDate) {
    match.fecha = { $gte: startDate, $lte: endDate };
  }
  return match;
};

export const obtenerFlujoCaja = async (req, res) => {
  try {
    const match = buildMatch(req.query);
    const totals = await Movimiento.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$sentido',
          total: { $sum: '$monto' }
        }
      }
    ]);

    const totalIngresosPeriodo = totals.find((item) => item._id === 'ingreso')?.total || 0;
    const totalEgresosPeriodo = totals.find((item) => item._id === 'egreso')?.total || 0;
    const balancePeriodo = totalIngresosPeriodo - totalEgresosPeriodo;

    let comparativoMesAnterior = null;
    if (req.query.anio && req.query.mes) {
      const { startDate, endDate } = getPreviousMonthRange(req.query.anio, req.query.mes);
      if (startDate && endDate) {
        const prevTotals = await Movimiento.aggregate([
          {
            $match: {
              ...match,
              fecha: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: '$sentido',
              total: { $sum: '$monto' }
            }
          }
        ]);
        const prevIngresos = prevTotals.find((item) => item._id === 'ingreso')?.total || 0;
        const prevEgresos = prevTotals.find((item) => item._id === 'egreso')?.total || 0;
        const balanceAnterior = prevIngresos - prevEgresos;
        comparativoMesAnterior = {
          balanceAnterior,
          diferencia: balancePeriodo - balanceAnterior
        };
      }
    }

    const breakdownIngresos = await Movimiento.aggregate([
      { $match: { ...match, sentido: 'ingreso' } },
      {
        $group: {
          _id: '$categoriaIngreso',
          total: { $sum: '$monto' }
        }
      },
      {
        $project: {
          categoria: { $ifNull: ['$_id', 'sin_categoria'] },
          total: 1,
          _id: 0
        }
      }
    ]);

    const breakdownEgresos = await Movimiento.aggregate([
      { $match: { ...match, sentido: 'egreso' } },
      {
        $group: {
          _id: '$categoriaEgreso',
          total: { $sum: '$monto' }
        }
      },
      {
        $project: {
          categoria: { $ifNull: ['$_id', 'sin_categoria'] },
          total: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalIngresosPeriodo,
      totalEgresosPeriodo,
      balancePeriodo,
      comparativoMesAnterior,
      breakdown: {
        ingresos: breakdownIngresos,
        egresos: breakdownEgresos
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar resumen de flujo de caja' });
  }
};

export const obtenerEstadoResultados = async (req, res) => {
  try {
    const match = buildMatch(req.query);
    const agregados = await Movimiento.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          ingresos: {
            $sum: {
              $cond: [{ $eq: ['$sentido', 'ingreso'] }, '$monto', 0]
            }
          },
          egresosOperativos: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$sentido', 'egreso'] },
                    { $eq: ['$tipoFlujo', 'operativo'] }
                  ]
                },
                '$monto',
                0
              ]
            }
          },
          egresosTotales: {
            $sum: {
              $cond: [{ $eq: ['$sentido', 'egreso'] }, '$monto', 0]
            }
          }
        }
      }
    ]);

    const resumen = agregados[0] || { ingresos: 0, egresosOperativos: 0, egresosTotales: 0 };
    const utilidadNeta = resumen.ingresos - resumen.egresosTotales;

    const ingresosPorCategoria = await Movimiento.aggregate([
      { $match: { ...match, sentido: 'ingreso' } },
      {
        $group: {
          _id: '$categoriaIngreso',
          total: { $sum: '$monto' }
        }
      },
      {
        $project: {
          categoria: { $ifNull: ['$_id', 'sin_categoria'] },
          total: 1,
          _id: 0
        }
      }
    ]);

    const egresosPorCategoria = await Movimiento.aggregate([
      { $match: { ...match, sentido: 'egreso' } },
      {
        $group: {
          _id: '$categoriaEgreso',
          total: { $sum: '$monto' }
        }
      },
      {
        $project: {
          categoria: { $ifNull: ['$_id', 'sin_categoria'] },
          total: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      ingresosTotales: resumen.ingresos || 0,
      egresosOperativos: resumen.egresosOperativos || 0,
      utilidadNeta,
      detalle: {
        ingresos: ingresosPorCategoria,
        egresos: egresosPorCategoria
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar estado de resultados' });
  }
};

export const obtenerKPIs = async (req, res) => {
  try {
    const match = buildMatch(req.query);

    const totales = await Movimiento.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          ingresos: {
            $sum: {
              $cond: [{ $eq: ['$sentido', 'ingreso'] }, '$monto', 0]
            }
          },
          egresos: {
            $sum: {
              $cond: [{ $eq: ['$sentido', 'egreso'] }, '$monto', 0]
            }
          }
        }
      }
    ]);

    const resumen = totales[0] || { ingresos: 0, egresos: 0 };
    const balance = resumen.ingresos - resumen.egresos;
    const margen = resumen.ingresos > 0 ? balance / resumen.ingresos : 0;

    const burnRateQuery = await Movimiento.aggregate([
      {
        $match: {
          sentido: 'egreso'
        }
      },
      {
        $group: {
          _id: {
            anio: { $year: '$fecha' },
            mes: { $month: '$fecha' }
          },
          total: { $sum: '$monto' }
        }
      },
      { $sort: { '_id.anio': -1, '_id.mes': -1 } },
      { $limit: 3 }
    ]);

    const burnRateMensual = burnRateQuery.length
      ? burnRateQuery.reduce((acc, cur) => acc + cur.total, 0) / burnRateQuery.length
      : 0;

    const tendencia = await Movimiento.aggregate([
      {
        $group: {
          _id: {
            anio: { $year: '$fecha' },
            mes: { $month: '$fecha' }
          },
          ingresos: {
            $sum: {
              $cond: [{ $eq: ['$sentido', 'ingreso'] }, '$monto', 0]
            }
          },
          egresos: {
            $sum: {
              $cond: [{ $eq: ['$sentido', 'egreso'] }, '$monto', 0]
            }
          }
        }
      },
      { $sort: { '_id.anio': -1, '_id.mes': -1 } },
      { $limit: 6 }
    ]);

    const tendenciaCaja = tendencia
      .map((item) => ({
        anio: item._id.anio,
        mes: item._id.mes,
        balance: item.ingresos - item.egresos
      }))
      .reverse();

    const distribucionEgresos = await Movimiento.aggregate([
      { $match: { ...match, sentido: 'egreso' } },
      {
        $group: {
          _id: '$categoriaEgreso',
          total: { $sum: '$monto' }
        }
      }
    ]);

    const totalEgresosPeriodo = distribucionEgresos.reduce((acc, cur) => acc + cur.total, 0);
    const distribucion = distribucionEgresos.map((item) => ({
      categoria: item._id || 'sin_categoria',
      porcentaje: totalEgresosPeriodo > 0 ? (item.total / totalEgresosPeriodo) * 100 : 0
    }));

    res.json({
      margen,
      balance,
      burnRateMensual,
      tendenciaCaja,
      distribucionEgresos: distribucion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar KPIs' });
  }
};
