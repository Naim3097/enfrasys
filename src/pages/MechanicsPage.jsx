import React, { useState, useEffect } from 'react';
import { getMechanics, createMechanic, updateMechanic, deleteMechanic } from '../services/dataService';
import { toast } from 'react-toastify';

function MechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMechanic, setEditingMechanic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    specialty: ''
  });

  useEffect(() => {
    loadMechanics();
  }, []);

  const loadMechanics = async () => {
    try {
      const mechanicsData = await getMechanics();
      setMechanics(mechanicsData);
    } catch (error) {
      console.error('Error loading mechanics:', error);
      toast.error('Failed to load mechanics');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contact) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingMechanic) {
        await updateMechanic(editingMechanic.id, formData);
        toast.success('Mechanic updated successfully');
      } else {
        await createMechanic(formData);
        toast.success('Mechanic created successfully');
      }

      setFormData({ name: '', contact: '', specialty: '' });
      setShowForm(false);
      setEditingMechanic(null);
      loadMechanics();
    } catch (error) {
      console.error('Error saving mechanic:', error);
      toast.error('Failed to save mechanic');
    }
  };

  const handleEdit = (mechanic) => {
    setEditingMechanic(mechanic);
    setFormData({
      name: mechanic.name || '',
      contact: mechanic.contact || '',
      specialty: mechanic.specialty || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mechanic?')) {
      try {
        await deleteMechanic(id);
        toast.success('Mechanic deleted successfully');
        loadMechanics();
      } catch (error) {
        console.error('Error deleting mechanic:', error);
        toast.error('Failed to delete mechanic');
      }
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', contact: '', specialty: '' });
    setShowForm(false);
    setEditingMechanic(null);
  };

  if (loading) {
    return <div className="loading">Loading mechanics...</div>;
  }

  return (
    <div className="page">      <div className="page-header">
        <h1 className="page-title">Mechanics</h1>
        <div className="flex gap-2">
          <button 
            className="btn btn-secondary" 
            onClick={() => window.location.href = '/mechanic-reports'}
          >
            View Reports
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(true)}
          >
            Add Mechanic
          </button>
        </div>
      </div>      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cancelForm()}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingMechanic ? 'Edit Mechanic' : 'Add New Mechanic'}
              </h3>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="name">Mechanic Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">Contact Information *</label>
                    <input
                      type="text"
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="e.g., john@oneX.com, (555) 123-4567"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="specialty">Specialty</label>
                  <select
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  >
                    <option value="">Select Specialty</option>
                    <option value="Gearbox Repair">Gearbox Repair</option>
                    <option value="Engine Diagnostics">Engine Diagnostics</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Electrical Systems">Electrical Systems</option>
                    <option value="Brake Systems">Brake Systems</option>
                    <option value="General Maintenance">General Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMechanic ? 'Update Mechanic' : 'Create Mechanic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Mechanics Directory</h3>
          <div className="card-subtitle">{mechanics.length} mechanics</div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Specialty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray">
                    No mechanics found. Click "Add Mechanic" to create your first mechanic.
                  </td>
                </tr>
              ) : (
                mechanics.map((mechanic) => (
                  <tr key={mechanic.id}>
                    <td className="font-semibold">{mechanic.name}</td>
                    <td>{mechanic.contact}</td>
                    <td>
                      <span className="status-badge bg-green text-green">
                        {mechanic.specialty || 'General'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => handleEdit(mechanic)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDelete(mechanic.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MechanicsPage;
