import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (filename, columns, data) => {
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => {
      if (col.exportValue) {
        return col.exportValue(row);
      }
      if (col.render) {
        return col.render(row);
      }
      return row[col.key];
    })
  );

  const worksheet = utils.aoa_to_sheet([headers, ...rows]);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Datos');
  writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (filename, columns, data) => {
  const doc = new jsPDF('l', 'pt');
  const headers = columns.map((col) => col.header);
  const rows = data.map((row) =>
    columns.map((col) => {
      if (col.exportValue) {
        return col.exportValue(row);
      }
      if (col.render) {
        return col.render(row);
      }
      return row[col.key];
    })
  );

  autoTable(doc, {
    head: [headers],
    body: rows
  });
  doc.save(`${filename}.pdf`);
};
