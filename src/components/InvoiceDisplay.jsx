import React from 'react';
import styles from './InvoiceDisplay.module.css';

function InvoiceDisplay({ invoice, isReadOnly = true, onEdit = null, showPrintButton = false }) {
  if (!invoice) {
    return <div>No invoice data available</div>;
  }
  const calculateTotal = () => {
    return invoice.items?.reduce((total, item) => {
      return total + (parseFloat(item.qty || 0) * parseFloat(item.price || 0));
    }, 0) || 0;
  };

  const handlePrint = () => {
    // Create a new window for printing with proper formatting
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintableInvoice(invoice, calculateTotal());
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  const generatePrintableInvoice = (invoice, total) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${invoice.workOrderId || 'INV'}</title>
      <style>
        @media print {
          @page { 
            margin: 1cm;
            size: A4;
          }
          body { margin: 0; }
        }
        
        body {
          font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.6;
          color: #2c3e50;
          background: #fff;
        }
        
        .invoice-header {
          background: linear-gradient(135deg, #168F60 0%, #71F1BB 100%);
          color: white;
          padding: 30px;
          margin: -20px -20px 30px -20px;
          border-radius: 0 0 15px 15px;
          box-shadow: 0 4px 15px rgba(22, 143, 96, 0.2);
          position: relative;
        }
        
        .invoice-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
          pointer-events: none;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .company-info {
          flex: 1;
        }
        
        .company-name {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          letter-spacing: 1px;
        }
        
        .company-tagline {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 300;
          letter-spacing: 0.5px;
        }
        
        .invoice-title {
          text-align: right;
          flex: 1;
        }
        
        .invoice-number {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
          background: rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 8px;
          display: inline-block;
          backdrop-filter: blur(10px);
        }        
        .invoice-date {
          font-size: 12px;
          opacity: 0.9;
          margin-top: 5px;
          font-weight: 300;
        }
        
        .invoice-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .customer-info, .work-order-info {
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 10px rgba(22, 143, 96, 0.08);
          position: relative;
        }
        
        .customer-info::before, .work-order-info::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #168F60, #71F1BB);
          border-radius: 2px 0 0 2px;
        }
        
        .section-title {
          font-weight: 700;
          color: #168F60;
          margin-bottom: 15px;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          padding-bottom: 8px;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(to right, #168F60, #71F1BB);
          border-radius: 1px;
        }
        
        .info-row {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        
        .info-label {
          font-weight: 600;
          color: #495057;
          display: inline-block;
          width: 110px;
          margin-right: 10px;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(22, 143, 96, 0.1);
        }
        
        .items-table th,
        .items-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .items-table th {
          background: linear-gradient(135deg, #168F60 0%, #71F1BB 100%);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 11px;
        }
        
        .items-table tbody tr {
          transition: background-color 0.2s ease;
        }
        
        .items-table tbody tr:nth-child(even) {
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
        }
        
        .items-table tbody tr:hover {
          background: linear-gradient(145deg, #e8f5e8 0%, #f0fdf4 100%);
        }
        
        .items-table .text-right {
          text-align: right;
          font-weight: 500;
        }
        
        .subtotal-row {
          background: linear-gradient(145deg, #168F60 0%, #71F1BB 100%) !important;
          color: white !important;
          font-weight: 600;
        }
        
        .subtotal-row td {
          border-bottom: none !important;
          font-size: 13px;
        }
        
        .total-section {
          margin-top: 30px;
          padding: 25px;
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 12px;
          border: 2px solid #168F60;
          box-shadow: 0 4px 20px rgba(22, 143, 96, 0.15);
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          font-weight: 700;
          color: #168F60;
        }
        
        .total-amount {
          font-size: 24px;
          color: #168F60;
          background: linear-gradient(135deg, #168F60, #71F1BB);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: none;
        }
        
        .footer {
          margin-top: 50px;
          padding: 25px;
          background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 12px;
          text-align: center;
          color: #6c757d;
          font-size: 11px;
          border-top: 3px solid #71F1BB;
        }
        
        .footer p {
          margin: 8px 0;
        }
        
        .footer p:first-child {
          font-weight: 600;
          color: #495057;
          font-size: 12px;
        }
        
        .notes-section {
          margin-top: 30px;
          padding: 25px;
          background: linear-gradient(145deg, #fff3cd 0%, #ffffff 100%);
          border-radius: 12px;
          border-left: 4px solid #ffc107;
          box-shadow: 0 2px 10px rgba(255, 193, 7, 0.1);
        }
        
        .notes-section .section-title {
          color: #856404;
        }
        
        .notes-section .section-title::after {
          background: #ffc107;
        }
        
        .payment-status {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-paid {
          background: linear-gradient(135deg, #d4edda, #f8fffe);
          color: #155724;
          border: 1px solid #c3e6cb;
        }
          .status-pending {
          background: linear-gradient(135deg, #fff3cd, #fffef8);
          color: #856404;
          border: 1px solid #ffeaa7;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="header-content">
          <div class="company-info">
            <div class="company-name">BYKI WORKSHOP</div>
            <div class="company-tagline">Professional Vehicle Maintenance & Repair Services</div>
          </div>
          <div class="invoice-title">
            <div class="invoice-number">INVOICE #${invoice.workOrderId ? `WO-${invoice.workOrderId.slice(-6)}` : 'LEGACY'}</div>
            <div class="invoice-date">${new Date(invoice.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        </div>
      </div>
      
      <div class="invoice-details">
        <div class="customer-info">
          <div class="section-title">BILL TO</div>
          <div class="info-row">
            <span class="info-label">Customer:</span>
            ${invoice.customerName}
          </div>
        </div>
        
        <div class="work-order-info">
          <div class="section-title">WORK ORDER</div>
          ${invoice.workOrderId ? `
          <div class="info-row">
            <span class="info-label">Work Order:</span>
            ${invoice.workOrderId}
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Date:</span>
            ${new Date(invoice.date).toLocaleDateString()}
          </div>
        </div>
      </div>
        ${(() => {
        const parts = invoice.items?.filter(item => item.type !== 'labor') || [];
        const labor = invoice.items?.filter(item => item.type === 'labor') || [];
        
        let html = '';
          if (parts.length > 0) {
          html += `
          <div class="section-title">🔧 Parts & Materials</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Part Name</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>              ${parts.map(item => `
                <tr>
                  <td>${item.partName || item.partId}</td>
                  <td class="text-right">${item.qty}</td>
                  <td class="text-right">RM${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td class="text-right">RM${(parseFloat(item.qty || 0) * parseFloat(item.price || 0)).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="subtotal-row">
                <td colspan="3">Parts Subtotal</td>
                <td class="text-right">RM${parts.reduce((total, item) => total + (parseFloat(item.qty || 0) * parseFloat(item.price || 0)), 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          `;
        }
          if (labor.length > 0) {
          html += `
          <div class="section-title">⚡ Labor Charges</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Labor Description</th>
                <th class="text-right">Hours</th>
                <th class="text-right">Rate (RM/hr)</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>              ${labor.map(item => `
                <tr>
                  <td>${item.partName || 'Labor Charge'}</td>
                  <td class="text-right">${item.qty}</td>
                  <td class="text-right">RM${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td class="text-right">RM${(parseFloat(item.qty || 0) * parseFloat(item.price || 0)).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="subtotal-row">
                <td colspan="3">Labor Subtotal</td>
                <td class="text-right">RM${labor.reduce((total, item) => total + (parseFloat(item.qty || 0) * parseFloat(item.price || 0)), 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          `;
        }
        
        if (parts.length === 0 && labor.length === 0) {
          html = `
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4" style="text-align: center; padding: 20px;">No items found</td>
              </tr>
            </tbody>
          </table>
          `;
        }
        
        return html;
      })()}
        <div class="total-section">
        <div class="total-row">
          <span>TOTAL AMOUNT:</span>
          <span class="total-amount">RM${total.toFixed(2)}</span>
        </div>
      </div>
      
      ${invoice.notes ? `
      <div class="notes-section">
        <div class="section-title">NOTES</div>
        <p>${invoice.notes}</p>
      </div>
      ` : ''}
        <div class="footer">
        <p>Thank you for choosing BYKI Workshop for your vehicle maintenance needs.</p>
        <p>This invoice was generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p style="margin-top: 15px; font-size: 10px; opacity: 0.7;">
          For questions about this invoice, please contact BYKI Workshop
        </p>
      </div>
    </body>
    </html>
    `;
  };  return (
    <div className={styles.invoiceDisplay}>
      <div className={styles.invoiceHeader}>
        <h3>Invoice</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {showPrintButton && (
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handlePrint}>
              🖨️ Print Invoice
            </button>
          )}
          {!isReadOnly && onEdit && (
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onEdit}>
              Edit Invoice
            </button>
          )}
        </div>
      </div>

      <div className={styles.invoiceDetails}>
        <div className={styles.invoiceInfo}>
          <p><strong>Customer:</strong> {invoice.customerName}</p>
          <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
          {invoice.workOrderId && (
            <p><strong>Work Order ID:</strong> {invoice.workOrderId}</p>
          )}          <div style={{ margin: '10px 0' }}>
            <strong>Payment Status: </strong>
            <span 
              className={styles.paymentStatus}
              style={{
                backgroundColor: invoice.paymentStatus === 'paid' ? '#d4edda' : '#fff3cd',
                color: invoice.paymentStatus === 'paid' ? '#155724' : '#856404',
                border: `1px solid ${invoice.paymentStatus === 'paid' ? '#c3e6cb' : '#ffeaa7'}`
              }}
            >
              {invoice.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
            </span>
          </div>
          {invoice.paymentStatus === 'paid' && invoice.paidDate && (
            <p><strong>Paid Date:</strong> {new Date(invoice.paidDate).toLocaleDateString()}</p>
          )}
          {invoice.paymentStatus === 'paid' && invoice.paymentMethod && (
            <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
          )}
          {invoice.notes && (
            <p><strong>Notes:</strong> {invoice.notes}</p>
          )}
        </div>        <div className={styles.invoiceItems}>
          <h4>Invoice Items</h4>
          
          {(() => {
            const parts = invoice.items?.filter(item => item.type !== 'labor') || [];
            const labor = invoice.items?.filter(item => item.type === 'labor') || [];
            
            return (
              <>
                {parts.length > 0 && (                  <div style={{ marginBottom: '2rem' }}>
                    <h5 style={{ color: '#2c3e50', marginBottom: '1rem' }}>🔧 Parts & Materials</h5>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Part Name</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parts.map((item, index) => (                          <tr key={`part-${index}`}>
                            <td>{item.partName || item.partId}</td>
                            <td>{item.qty}</td>
                            <td>RM{parseFloat(item.price || 0).toFixed(2)}</td>
                            <td>RM{(parseFloat(item.qty || 0) * parseFloat(item.price || 0)).toFixed(2)}</td>
                          </tr>
                        ))}                        <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                          <td colSpan="3">Parts Subtotal:</td>
                          <td>RM{parts.reduce((total, item) => total + (parseFloat(item.qty || 0) * parseFloat(item.price || 0)), 0).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                  {labor.length > 0 && (                  <div style={{ marginBottom: '2rem' }}>
                    <h5 style={{ color: '#2c3e50', marginBottom: '1rem' }}>⚡ Labor Charges</h5>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Labor Description</th>
                          <th>Hours</th>
                          <th>Rate (RM/hour)</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labor.map((item, index) => (
                          <tr key={`labor-${index}`}>
                            <td>{item.partName || 'Labor Charge'}</td>
                            <td>{item.qty}</td>                            <td>RM{parseFloat(item.price || 0).toFixed(2)}</td>
                            <td>RM{(parseFloat(item.qty || 0) * parseFloat(item.price || 0)).toFixed(2)}</td>
                          </tr>
                        ))}                        <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                          <td colSpan="3">Labor Subtotal:</td>
                          <td>RM{labor.reduce((total, item) => total + (parseFloat(item.qty || 0) * parseFloat(item.price || 0)), 0).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                  {parts.length === 0 && labor.length === 0 && (
                  <div className={styles.emptyState}>
                    No items found in this invoice.
                  </div>
                )}                <div className={styles.totalSection}>
                  <span className={styles.totalLabel}>TOTAL AMOUNT:</span>
                  <span className={styles.totalAmount}>RM{calculateTotal().toFixed(2)}</span>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default InvoiceDisplay;
