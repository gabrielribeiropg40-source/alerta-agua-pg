import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { dbReports } from './db';

export const generateWeeklyReport = () => {
  const doc = new jsPDF();
  const reports = dbReports.getAll();
  
  // Date filtering logic could be added here for strictly "Weekly"
  // For MVP, we will print all stored reports
  
  doc.setFontSize(20);
  doc.text('Relatório de Qualidade da Água - Ponta Grossa', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Total de Denúncias no Sistema: ${reports.length}`, 14, 32);
  doc.text(`Data de Geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 40);

  // Group by Neighborhood
  const bairrosCount = reports.reduce((acc, report) => {
    acc[report.bairro] = (acc[report.bairro] || 0) + 1;
    return acc;
  }, {});

  const rankings = Object.entries(bairrosCount).sort((a, b) => b[1] - a[1]);
  
  doc.text('Bairros Mais Afetados:', 14, 55);
  rankings.slice(0, 5).forEach((item, index) => {
    doc.text(`${index + 1}. ${item[0]} (${item[1]} denúncias)`, 14, 65 + (index * 8));
  });

  const tableData = reports.map(r => [
    new Date(r.data).toLocaleDateString('pt-BR'),
    r.bairro,
    r.cor_agua,
    r.cheiro,
    r.descricao ? r.descricao.substring(0, 30) + '...' : '-'
  ]);

  doc.text('Lista de Ocorrências (Resumo):', 14, 120);

  doc.autoTable({
    startY: 130,
    head: [['Data', 'Bairro', 'Cor', 'Cheiro', 'Descrição']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [26, 86, 219] }
  });

  doc.save(`Relatorio_Agua_PG_${new Date().getTime()}.pdf`);
};
