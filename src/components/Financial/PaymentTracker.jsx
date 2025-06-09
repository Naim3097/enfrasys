import React, { useState, useEffect } from 'react';
import { getUnpaidInvoices, markInvoiceAsPaid, getUnpaidCommissions, updateCommissionStatus } from '../../services/dataService';
import { toast } from 'react-toastify';

const PaymentTracker = ({ onPaymentUpdate }) => {
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [unpaidCommissions, setUnpaidCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    loadUnpaidItems();
  }, []);

  const loadUnpaidItems = async () => {
    try {
      const [invoices, commissions] = await Promise.all([
        getUnpaidInvoices(),
        getUnpaidCommissions()
      ]);
      setUnpaidInvoices(invoices);
      setUnpaidCommissions(commissions);
    } catch (error) {
      console.error('Error loading unpaid items:', error);
      toast.error('Failed to load payment tracker');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkInvoicePaid = async (invoiceId, amount) => {
    try {
      setProcessingPayment(invoiceId);
      await markInvoiceAsPaid(invoiceId, amount);
      toast.success('Invoice marked as paid');
      await loadUnpaidItems();
      if (onPaymentUpdate) onPaymentUpdate();
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast.error('Failed to update payment status');
    } finally {
      setProcessingPayment(null);
    }
  };
  const handleMarkCommissionPaid = async (workOrderId, amount) => {
    try {
      setProcessingPayment(workOrderId);
      // Using the new updateCommissionStatus function for greater flexibility
      await updateCommissionStatus(workOrderId, true);
      toast.success('Commission marked as paid');
      await loadUnpaidItems();
      if (onPaymentUpdate) onPaymentUpdate();
    } catch (error) {
      console.error('Error marking commission as paid:', error);
      toast.error('Failed to update commission payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const calculateInvoiceTotal = (invoice) => {
    return invoice.items?.reduce((total, item) => total + (item.qty * item.price), 0) || 0;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📋 Payment Tracker</h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading payment data...
        </div>
      </div>
    );
  }

  const hasUnpaidItems = unpaidInvoices.length > 0 || unpaidCommissions.length > 0;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">📋 Payment Tracker</h3>
        <span className="badge" style={{ 
          backgroundColor: hasUnpaidItems ? '#dc3545' : '#28a745',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '12px',
          fontSize: '0.75rem'
        }}>
          {hasUnpaidItems ? `${unpaidInvoices.length + unpaidCommissions.length} pending` : 'All paid ✓'}
        </span>
      </div>
      
      <div style={{ padding: '1rem' }}>
        {/* Unpaid Invoices */}
        {unpaidInvoices.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#dc3545' }}>💳 Unpaid Invoices</h4>
            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
              {unpaidInvoices.map((invoice, index) => {
                const total = calculateInvoiceTotal(invoice);
                return (
                  <div 
                    key={invoice.id}
                    style={{
                      padding: '1rem',
                      borderBottom: index < unpaidInvoices.length - 1 ? '1px solid #dee2e6' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{invoice.customerName}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {invoice.workOrderId ? `Work Order: ${invoice.workOrderId.slice(-6)}` : 'Legacy Invoice'} • 
                        {new Date(invoice.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        RM{total.toFixed(2)}
                      </div>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleMarkInvoicePaid(invoice.id, total)}
                        disabled={processingPayment === invoice.id}
                      >
                        {processingPayment === invoice.id ? 'Processing...' : 'Mark Paid'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Unpaid Commissions */}
        {unpaidCommissions.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#ffc107' }}>👨‍🔧 Unpaid Commissions</h4>
            <div style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
              {unpaidCommissions.map((commission, index) => (
                <div 
                  key={commission.workOrderId}
                  style={{
                    padding: '1rem',
                    borderBottom: index < unpaidCommissions.length - 1 ? '1px solid #dee2e6' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{commission.mechanicName}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Work Order: {commission.workOrderId.slice(-6)} • 
                      {new Date(commission.completedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      RM{commission.amount.toFixed(2)}
                    </div>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleMarkCommissionPaid(commission.workOrderId, commission.amount)}
                      disabled={processingPayment === commission.workOrderId}
                    >
                      {processingPayment === commission.workOrderId ? 'Processing...' : 'Pay Commission'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No unpaid items */}
        {!hasUnpaidItems && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#28a745',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            border: '1px solid #c3e6cb'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>✅ All payments are up to date!</h4>
            <p style={{ margin: 0, color: '#155724' }}>
              No pending invoices or commissions require attention.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTracker;
