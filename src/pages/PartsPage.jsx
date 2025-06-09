import React, { useState, useEffect } from 'react';
import { getParts, createPart, updatePart, deletePart, updateStock } from '../services/dataService';
import { toast } from 'react-toastify';

function PartsPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unitPrice: '',
    currentStock: ''
  });

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const partsData = await getParts();
      setParts(partsData);
    } catch (error) {
      console.error('Error loading parts:', error);
      toast.error('Failed to load parts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.unitPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const partData = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        currentStock: parseInt(formData.currentStock) || 0
      };

      if (editingPart) {
        await updatePart(editingPart.id, partData);
        toast.success('Part updated successfully');
      } else {
        await createPart(partData);
        toast.success('Part created successfully');
      }

      setFormData({ name: '', sku: '', unitPrice: '', currentStock: '' });
      setShowForm(false);
      setEditingPart(null);
      loadParts();
    } catch (error) {
      console.error('Error saving part:', error);
      toast.error('Failed to save part');
    }
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      sku: part.sku,
      unitPrice: part.unitPrice.toString(),
      currentStock: part.currentStock.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await deletePart(id);
        toast.success('Part deleted successfully');
        loadParts();
      } catch (error) {
        console.error('Error deleting part:', error);
        toast.error('Failed to delete part');
      }
    }
  };

  const handleStockAdjustment = async (partId, newStock) => {
    try {
      await updateStock(partId, parseInt(newStock));
      toast.success('Stock updated successfully');
      loadParts();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', sku: '', unitPrice: '', currentStock: '' });
    setShowForm(false);
    setEditingPart(null);
  };

  if (loading) {
    return <div className="loading">Loading parts...</div>;
  }
  return (
    <div className="container">
      {/* Parts Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-majestic text-2xl font-bold mb-1">Parts Management</h1>
          <p className="text-cool-gray text-sm">Manage your parts inventory and stock levels</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add New Part
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingPart ? 'Edit Part' : 'Add New Part'}
              </h3>
              <button className="modal-close" onClick={cancelForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="grid-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="name">Part Name *</label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sku">SKU *</label>
                    <input
                      type="text"
                      id="sku"
                      className="form-input"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="unitPrice">Unit Price (RM) *</label>
                    <input
                      type="number"
                      step="0.01"
                      id="unitPrice"
                      className="form-input"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="currentStock">Current Stock</label>
                    <input
                      type="number"
                      id="currentStock"
                      className="form-input"
                      value={formData.currentStock}
                      onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPart ? 'Update Part' : 'Create Part'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parts Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Parts Inventory</h2>
          <span className="badge badge-primary">{parts.length} parts</span>
        </div>
        <div className="card-body">
          {parts.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>SKU</th>
                    <th>Unit Price</th>
                    <th>Stock Level</th>
                    <th>Stock Adjustment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => (
                    <tr key={part.id} className={part.currentStock < 5 ? 'border-l-4 border-red-500 bg-red-50' : ''}>
                      <td className="font-medium">{part.name}</td>
                      <td className="text-cool-gray">{part.sku}</td>
                      <td className="font-mono">RM{part.unitPrice?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge ${part.currentStock < 5 ? 'badge-warning' : 'badge-success'}`}>
                          {part.currentStock}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-input w-20"
                          defaultValue={part.currentStock}
                          onBlur={(e) => {
                            const newStock = e.target.value;
                            if (newStock !== part.currentStock.toString()) {
                              handleStockAdjustment(part.id, newStock);
                            }
                          }}
                        />
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleEdit(part)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => handleDelete(part.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-cool-gray mb-4">No parts found. Add your first part to get started.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add First Part
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PartsPage;
