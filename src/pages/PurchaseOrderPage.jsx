import React, { useState, useEffect } from 'react';
import { getParts, getSuppliers, getPurchaseOrders, createPurchaseOrder } from '../services/dataService';
import { toast } from 'react-toastify';

function PurchaseOrderPage() {
  const [parts, setParts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    items: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [partsData, suppliersData, poData] = await Promise.all([
        getParts(),
        getSuppliers(),
        getPurchaseOrders()
      ]);
      setParts(partsData);
      setSuppliers(suppliersData);
      setPurchaseOrders(poData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    const supplier = suppliers.find(s => s.id === supplierId);
    setFormData({
      ...formData,
      supplierId,
      supplierName: supplier ? supplier.name : ''
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { partId: '', partName: '', qty: '', cost: '' }]
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    if (field === 'partId') {
      const part = parts.find(p => p.id === value);
      updatedItems[index].partName = part ? part.name : '';
    }
    
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.supplierId || formData.items.length === 0) {
      toast.error('Please select a supplier and add at least one item');
      return;
    }

    const invalidItems = formData.items.some(item => !item.partId || !item.qty || !item.cost);
    if (invalidItems) {
      toast.error('Please fill in all item details');
      return;
    }

    try {
      const poData = {
        supplierId: formData.supplierId,
        supplierName: formData.supplierName,
        items: formData.items.map(item => ({
          partId: item.partId,
          partName: item.partName,
          qty: parseInt(item.qty),
          cost: parseFloat(item.cost)
        }))
      };

      await createPurchaseOrder(poData);
      toast.success('Purchase order created successfully');
      
      setFormData({ supplierId: '', supplierName: '', items: [] });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast.error('Failed to create purchase order');
    }
  };

  const cancelForm = () => {
    setFormData({ supplierId: '', supplierName: '', items: [] });
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading purchase orders...</div>;
  }
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Purchase Orders</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
        >
          Create Purchase Order
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cancelForm()}>
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h3 className="modal-title">Create Purchase Order</h3>
              <button 
                className="modal-close"
                onClick={cancelForm}
                type="button"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="supplier">Supplier *</label>
                  <select
                    id="supplier"
                    value={formData.supplierId}
                    onChange={handleSupplierChange}
                    required
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-section">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Items</h4>
                    <button type="button" className="btn btn-secondary" onClick={addItem}>
                      Add Item
                    </button>
                  </div>
                  
                  {formData.items.length === 0 ? (
                    <div className="empty-state">
                      <p className="text-gray">No items added yet. Click "Add Item" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                                    {part.name} ({part.sku})
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
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Unit Cost (RM)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.cost}
                                onChange={(e) => updateItem(index, 'cost', e.target.value)}
                                min="0"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label>Total</label>
                              <input
                                type="text"
                                value={item.qty && item.cost ? `RM${(parseFloat(item.qty) * parseFloat(item.cost)).toFixed(2)}` : 'RM0.00'}
                                readOnly
                                className="bg-gray-50"
                              />
                            </div>
                            <div className="form-group">
                              <label>&nbsp;</label>
                              <button
                                type="button"
                                className="btn btn-danger w-full"
                                onClick={() => removeItem(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <div className="btn-group">
                  <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Purchase Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Purchase Orders History</h3>
        </div>
        {purchaseOrders.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th className="text-right">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po.id}>
                    <td>{new Date(po.date).toLocaleDateString()}</td>
                    <td className="font-semibold">{po.supplierName}</td>
                    <td>
                      <span className="badge bg-green text-green">
                        {po.items.length} items
                      </span>
                    </td>
                    <td className="text-right font-semibold">
                      RM{po.items.reduce((total, item) => total + (item.qty * item.cost), 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h4>No Purchase Orders Yet</h4>
            <p className="text-gray">Create your first purchase order to track supplier orders and inventory restocking.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderPage;
