const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const studentRepository = require('../repositories/studentRepository');

const EXPORT_COLUMNS = [
  { header: 'USN / Library ID', key: 'idLabel', width: 20 },
  { header: 'Student Name', key: 'name', width: 25 },
  { header: 'Department', key: 'departmentName', width: 18 },
  { header: 'Program', key: 'programName', width: 12 },
  { header: 'Semester', key: 'semester', width: 10 },
  { header: 'Section', key: 'sectionName', width: 10 },
  { header: 'Academic Year', key: 'academicYear', width: 14 },
  // { header: 'Status', key: 'status', width: 12 },
];

async function fetchFilteredStudents(filters) {
  const { rows } = await studentRepository.findAll({
    ...filters,
    page: 1,
    pageSize: 100000, // export = all matching records, not paginated
  });
  return rows.map((r) => {
    let idLabel = '-';
    if (r.usn && r.libraryId) idLabel = `${r.usn} / ${r.libraryId}`;
    else if (r.usn || r.libraryId) idLabel = r.usn || r.libraryId;
    return { ...r, idLabel };
  });
}

async function previewStudents(filters) {
  const rows = await fetchFilteredStudents(filters);
  return {
    total: rows.length,
    sample: rows.slice(0, 5),
  };
}

async function buildExcelBuffer(filters) {
  const rows = await fetchFilteredStudents(filters);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Students');
  sheet.columns = EXPORT_COLUMNS;
  sheet.getRow(1).font = { bold: true };
  rows.forEach((row) => sheet.addRow(row));
  return workbook.xlsx.writeBuffer();
}

function buildPdfStream(filters, res) {
  return fetchFilteredStudents(filters).then((rows) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    doc.pipe(res);

    doc.fontSize(16).text('Student Records', { align: 'center' });
    doc.moveDown();

    const colWidths = [110, 140, 100, 60, 60, 60, 80, 70];
    const startX = doc.x;
    let y = doc.y;

    doc.fontSize(10).font('Helvetica-Bold');
    EXPORT_COLUMNS.forEach((col, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(col.header, x, y, { width: colWidths[i] });
    });

    doc.font('Helvetica');
    y += 20;
    rows.forEach((row) => {
      EXPORT_COLUMNS.forEach((col, i) => {
        const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.text(String(row[col.key] ?? '-'), x, y, { width: colWidths[i] });
      });
      y += 18;
      if (y > 500) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  });
}

module.exports = { previewStudents, buildExcelBuffer, buildPdfStream };
