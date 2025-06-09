import React, { useState, useEffect } from 'react';
import { getParts, getInvoices, createInvoice } from '../services/dataService';
import { toast } from 'react-toastify';

function InvoicePage() {
  const [parts, setParts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    items: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partsData, invoicesData] = await Promise.all([
        getParts(),
        getInvoices()
      ]);
      setParts(partsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { partId: '', partName: '', qty: '', price: '' }]
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    if (field === 'partId') {
      const part = parts.find(p => p.id === value);
      if (part) {
        updatedItems[index].partName = part.name;
        updatedItems[index].price = part.unitPrice.toString();
      }
    }
    
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || formData.items.length === 0) {
      toast.error('Please enter customer name and add at least one item');
      return;
    }

    const invalidItems = formData.items.some(item => !item.partId || !item.qty || !item.price);
    if (invalidItems) {
      toast.error('Please fill in all item details');
      return;
    }

    // Check stock availability
    const stockIssues = [];
    for (const item of formData.items) {
      const part = parts.find(p => p.id === item.partId);
      if (part && part.currentStock < parseInt(item.qty)) {
        stockIssues.push(`${part.name}: requested ${item.qty}, available ${part.currentStock}`);
      }
    }

    if (stockIssues.length > 0) {
      toast.error(`Insufficient stock: ${stockIssues.join(', ')}`);
      return;
    }

    try {
      const invoiceData = {
        customerName: formData.customerName,
        items: formData.items.map(item => ({
          partId: item.partId,
          partName: item.partName,
          qty: parseInt(item.qty),
          price: parseFloat(item.price)
        }))
      };

      await createInvoice(invoiceData);
      toast.success('Invoice created successfully');
      
      setFormData({ customerName: '', items: [] });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const cancelForm = () => {
    setFormData({ customerName: '', items: [] });
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Create Invoice
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Create Invoice</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Customer Name *</label>
              <input
                type="text"
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>

            <div className="items-section">
              <h4>Items</h4>
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="form-group">
                    <label>Part</label>
                    <select
                      value={item.partId}
                      onChange={(e) => updateItem(index, 'partId', e.target.value)}
                      required
                    >
                      <option value="">Select a part</option>
                      {parts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name} ({part.sku}) - Stock: {part.currentStock}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateItem(index, 'qty', e.target.value)}
                      min="1"
                      max={item.partId ? parts.find(p => p.id === item.partId)?.currentStock : ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Total</label>
                    <input
                      type="text"
                      value={item.qty && item.price ? `RM${(parseFloat(item.qty) * parseFloat(item.price)).toFixed(2)}` : 'RM0.00'}
                      readOnly
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeItem(index)}
                      style={{ marginTop: '1.5rem' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary add-item-btn" onClick={addItem}>
                Add Item
              </button>
            </div>

            {formData.items.length > 0 && (
              <div className="card" style={{ marginTop: '1rem', backgroundColor: '#f8f9fa' }}>
                <h4>Invoice Total: RM{formData.items.reduce((total, item) => {
                  return total + (parseFloat(item.qty || 0) * parseFloat(item.price || 0));
                }, 0).toFixed(2)}</h4>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Invoices History</h3>
        </div>
        {invoices.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    <td>{invoice.customerName}</td>
                    <td>{invoice.items.length} items</td>
                    <td>
                      ${invoice.items.reduce((total, item) => total + (item.qty * item.price), 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No invoices found. Create your first invoice to get started.</p>
        )}
      </div>
    </div>
  );
}

export default InvoicePage;
