'use client';

import { formatCurrency } from '@/lib/tax-engine';

// PDF content types
export interface PDFSection {
  title: string;
  rows: PDFRow[];
}

export interface PDFRow {
  label: string;
  value: string | number;
  isCurrency?: boolean;
  isSubItem?: boolean;
  isTotal?: boolean;
  isDeduction?: boolean;
}

export interface PDFContent {
  calculatorType: string;
  generatedDate: string;
  inputSummary: PDFSection;
  breakdown: PDFSection[];
  taxBands?: {
    band: string;
    rate: string;
    amount: number;
    tax: number;
  }[];
  summary: {
    totalTax: number;
    effectiveRate?: number;
    netIncome?: number;
  };
  comparison?: {
    oldTax: number;
    newTax: number;
    savings: number;
    savingsPercent: number;
  };
  legalReferences?: string[];
}

// Generate printable HTML content for PDF
export function generatePDFHTML(content: PDFContent): string {
  const formatValue = (value: string | number, isCurrency?: boolean, isDeduction?: boolean) => {
    if (typeof value === 'string') return value;
    const formatted = isCurrency !== false ? formatCurrency(Math.abs(value)) : value.toString();
    return isDeduction ? `(${formatted})` : formatted;
  };

  const sectionHTML = (section: PDFSection) => `
    <div class="section">
      <h3>${section.title}</h3>
      <table class="breakdown-table">
        ${section.rows.map(row => `
          <tr class="${row.isTotal ? 'total-row' : ''} ${row.isSubItem ? 'sub-item' : ''}">
            <td class="label">${row.isSubItem ? '└ ' : ''}${row.label}</td>
            <td class="value ${row.isDeduction ? 'deduction' : ''}">${formatValue(row.value, row.isCurrency, row.isDeduction)}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;

  const taxBandsHTML = content.taxBands ? `
    <div class="section">
      <h3>Tax Breakdown by Band</h3>
      <table class="bands-table">
        <thead>
          <tr>
            <th>Band</th>
            <th>Rate</th>
            <th>Taxable Amount</th>
            <th>Tax</th>
          </tr>
        </thead>
        <tbody>
          ${content.taxBands.map(band => `
            <tr>
              <td>${band.band}</td>
              <td>${band.rate}</td>
              <td class="amount">${formatCurrency(band.amount)}</td>
              <td class="amount">${formatCurrency(band.tax)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  const comparisonHTML = content.comparison ? `
    <div class="section comparison">
      <h3>Comparison: Old Law vs 2026</h3>
      <div class="comparison-grid">
        <div class="comparison-item">
          <span class="comp-label">Old Law Tax</span>
          <span class="comp-value old">${formatCurrency(content.comparison.oldTax)}</span>
        </div>
        <div class="comparison-item">
          <span class="comp-label">2026 Tax</span>
          <span class="comp-value new">${formatCurrency(content.comparison.newTax)}</span>
        </div>
        <div class="comparison-item savings">
          <span class="comp-label">${content.comparison.savings >= 0 ? 'Savings' : 'Additional Tax'}</span>
          <span class="comp-value">${formatCurrency(Math.abs(content.comparison.savings))} (${Math.abs(content.comparison.savingsPercent).toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  ` : '';

  const legalHTML = content.legalReferences?.length ? `
    <div class="section legal">
      <h3>Legal References</h3>
      <ul>
        ${content.legalReferences.map(ref => `<li>${ref}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tax Calculation Report - TaxCalc Nigeria</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: 'Segoe UI', system-ui, sans-serif; 
          color: #1a1a2e; 
          line-height: 1.5;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #1E3A5F;
        }
        .header .brand { 
          font-size: 24px; 
          font-weight: bold;
        }
        .header .brand-primary { color: #1E3A5F; }
        .header .brand-accent { color: #10B981; }
        .header .subtitle { 
          color: #666; 
          margin-top: 5px;
          font-size: 14px;
        }
        .header .calculator-type {
          background: #1E3A5F;
          color: white;
          display: inline-block;
          padding: 8px 20px;
          border-radius: 20px;
          margin-top: 15px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .section {
          margin-bottom: 25px;
        }
        .section h3 {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #1E3A5F;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .breakdown-table {
          width: 100%;
          border-collapse: collapse;
        }
        .breakdown-table tr {
          border-bottom: 1px solid #f0f0f0;
        }
        .breakdown-table td {
          padding: 8px 0;
        }
        .breakdown-table .label {
          color: #555;
        }
        .breakdown-table .value {
          text-align: right;
          font-family: 'Consolas', monospace;
          font-weight: 500;
        }
        .breakdown-table .deduction {
          color: #e74c3c;
        }
        .breakdown-table .total-row {
          border-top: 2px solid #1E3A5F;
          font-weight: bold;
        }
        .breakdown-table .total-row .label,
        .breakdown-table .total-row .value {
          color: #1E3A5F;
          padding-top: 12px;
        }
        .breakdown-table .sub-item .label {
          color: #888;
          font-size: 13px;
        }
        
        .bands-table {
          width: 100%;
          border-collapse: collapse;
        }
        .bands-table th {
          background: #f5f5f5;
          padding: 10px 8px;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
        }
        .bands-table th:nth-child(3),
        .bands-table th:nth-child(4) {
          text-align: right;
        }
        .bands-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #f0f0f0;
        }
        .bands-table .amount {
          text-align: right;
          font-family: 'Consolas', monospace;
        }
        
        .summary-box {
          background: linear-gradient(135deg, #1E3A5F 0%, #2d5a8a 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
        }
        .summary-box h3 {
          border: none;
          color: rgba(255,255,255,0.8);
          margin-bottom: 15px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-item .label {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        .summary-item .value {
          font-size: 22px;
          font-weight: bold;
          font-family: 'Consolas', monospace;
        }
        
        .comparison {
          background: #f8fffe;
          border: 1px solid #10B981;
          border-radius: 8px;
          padding: 20px;
        }
        .comparison h3 {
          color: #10B981;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .comparison-item {
          text-align: center;
        }
        .comp-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        .comp-value {
          font-family: 'Consolas', monospace;
          font-size: 18px;
          font-weight: bold;
        }
        .comp-value.old { color: #666; }
        .comp-value.new { color: #1E3A5F; }
        .comparison-item.savings .comp-value { color: #10B981; }
        
        .legal ul {
          list-style: none;
          font-size: 13px;
          color: #666;
        }
        .legal li {
          padding: 4px 0;
          padding-left: 15px;
          position: relative;
        }
        .legal li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #1E3A5F;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          text-align: center;
          font-size: 11px;
          color: #888;
        }
        
        @media print {
          body { padding: 20px; }
          .summary-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">
          <span class="brand-primary">TaxCalc</span><span class="brand-accent">Nigeria</span>
        </div>
        <div class="subtitle">Tax Calculation Report • Generated ${content.generatedDate}</div>
        <div class="calculator-type">${content.calculatorType}</div>
      </div>
      
      ${sectionHTML(content.inputSummary)}
      
      ${content.breakdown.map(section => sectionHTML(section)).join('')}
      
      ${taxBandsHTML}
      
      <div class="summary-box">
        <h3>Summary</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="label">Total Tax</div>
            <div class="value">${formatCurrency(content.summary.totalTax)}</div>
          </div>
          ${content.summary.effectiveRate !== undefined ? `
            <div class="summary-item">
              <div class="label">Effective Rate</div>
              <div class="value">${content.summary.effectiveRate.toFixed(1)}%</div>
            </div>
          ` : ''}
          ${content.summary.netIncome !== undefined ? `
            <div class="summary-item">
              <div class="label">Net Income</div>
              <div class="value">${formatCurrency(content.summary.netIncome)}</div>
            </div>
          ` : ''}
        </div>
      </div>
      
      ${comparisonHTML}
      
      ${legalHTML}
      
      <div class="footer">
        <p><strong>Disclaimer:</strong> This report is for informational purposes only and does not constitute tax advice.</p>
        <p>Based on Nigeria Tax Act 2026 • © ${new Date().getFullYear()} TaxCalc Nigeria</p>
      </div>
    </body>
    </html>
  `;
}

// Generate and download PDF
export async function downloadPDF(content: PDFContent, filename?: string): Promise<void> {
  const html = generatePDFHTML(content);
  
  // Create a new window with the content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window. Please allow popups.');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

// Alternative: Generate blob for direct download (requires html2canvas + jspdf)
export function openPrintView(content: PDFContent): void {
  const html = generatePDFHTML(content);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
