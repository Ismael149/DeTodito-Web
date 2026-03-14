import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const pdfService = {
  generateTableReport: (title: string, columns: string[], rows: any[][], fileName: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Configuración de colores (Marca DeTodito)
    const primaryColor = [245, 124, 0]; // Naranja DeTodito (#f57c00)
    const headerColor = [52, 58, 64];   // Gris oscuro (#343a40)
    const white = [255, 255, 255];

    // Header Rect
    doc.setFillColor(white[0], white[1], white[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo / Título
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DeTodito', 14, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const reportDate = new Date();
    doc.text('¡Tu mercado en confianza! - ' + reportDate.toLocaleString(), 14, 33);

    // Línea divisora
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 38, pageWidth - 14, 38);

    // Título del reporte
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 14, 55);

    // Generación de la tabla
    autoTable(doc, {
      startY: 65,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: headerColor as [number, number, number],
        textColor: 255,
        fontSize: 10,
        halign: 'left'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { left: 14, right: 14 }
    });

    // Pie de página
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(
        'DeTodito - Marketplace Digital',
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 15,
        { align: 'center' }
      );

      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    doc.save(`${fileName}_${new Date().getTime()}.pdf`);
  },

  generateOrderInvoice: async (order: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryColor = [245, 124, 0];

    // Header
    doc.setFillColor(245, 124, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('DeTodito', 14, 25);
    doc.setFontSize(10);
    doc.text('FACTURA DE COMPRA', pageWidth - 60, 25);

    // Order Info
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(12);
    doc.text(`Orden: #${order.id}`, 14, 55);
    doc.text(`Fecha: ${new Date(order.created_at).toLocaleDateString()}`, 14, 62);
    doc.text(`Estado: ${order.status.toUpperCase()}`, 14, 69);

    // Items Table
    const columns = ['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal'];
    const rows = order.items.map((item: any) => [
      item.product_name,
      item.quantity,
      `$${parseFloat(item.price).toFixed(2)}`,
      `$${(item.quantity * parseFloat(item.price)).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 80,
      head: [columns],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [52, 58, 64] }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: $${parseFloat(order.total).toFixed(2)}`, pageWidth - 60, finalY);

    doc.save(`factura_${order.id}.pdf`);
  }
};
