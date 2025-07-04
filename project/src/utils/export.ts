import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Rapport } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToExcel = (rapports: Rapport[], filename?: string) => {
  const data = rapports.map(rapport => ({
    'Date': format(new Date(rapport.date), 'dd/MM/yyyy', { locale: fr }),
    'Topographe': rapport.userName,
    'Projet': rapport.projetNom,
    'Phase': rapport.phaseNom === 'Autre' ? rapport.phaseAutre || 'Autre' : rapport.phaseNom,
    'Type Structure': rapport.typeStructure === 'pile' ? 'Pile' : 'Culée',
    'N° Structure': rapport.numeroStructure,
    'Tâches': rapport.taches.join(', '),
    'Station': rapport.stationNom,
    'Remarques': rapport.remarques
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapports');

  const fileName = filename || `SERO-EST_Rapports_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportToPDF = (rapports: Rapport[], filename?: string) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(16);
  doc.text('SERO-EST - Rapports Topographiques', 20, 20);
  doc.setFontSize(12);
  doc.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, 20, 30);
  
  // Données du tableau
  const tableData = rapports.map(rapport => [
    format(new Date(rapport.date), 'dd/MM/yyyy', { locale: fr }),
    rapport.userName,
    rapport.projetNom,
    rapport.phaseNom === 'Autre' ? rapport.phaseAutre || 'Autre' : rapport.phaseNom,
    rapport.typeStructure === 'pile' ? 'Pile' : 'Culée',
    rapport.numeroStructure,
    rapport.taches.join(', '),
    rapport.stationNom,
    rapport.remarques
  ]);

  doc.autoTable({
    head: [['Date', 'Topographe', 'Projet', 'Phase', 'Type', 'N° Struct.', 'Tâches', 'Station', 'Remarques']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  const fileName = filename || `SERO-EST_Rapports_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
  doc.save(fileName);
};