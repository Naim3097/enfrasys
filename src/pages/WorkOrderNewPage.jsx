import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCustomers, getMechanics, createWorkOrder, createSchedule, getAvailableTimeSlots } from '../services/dataService';
import { toast } from 'react-toastify';

function WorkOrderNewPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);  const [formData, setFormData] = useState({
    customerId: '',
    mechanicId: '',
    description: ''
  });
  const [scheduleOptions, setScheduleOptions] = useState({
    enableScheduling: false,
    scheduledDate: '',
    startTime: '',
    duration: 60,
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      const [customersData, mechanicsData] = await Promise.all([
        getCustomers(),
        getMechanics()
      ]);
      
      setCustomers(customersData);
      setMechanics(mechanicsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load customers and mechanics');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (mechanicId, date) => {
    if (!mechanicId || !date) {
      setAvailableSlots([]);
      return;
    }

    try {
      const slots = await getAvailableTimeSlots(mechanicId, date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleScheduleOptionChange = (field, value) => {
    const newOptions = { ...scheduleOptions, [field]: value };
    setScheduleOptions(newOptions);

    // Load available slots when mechanic and date are selected
    if (field === 'scheduledDate' || (field === 'enableScheduling' && value)) {
      loadAvailableSlots(formData.mechanicId, newOptions.scheduledDate);
    }
  };

  const handleMechanicChange = (mechanicId) => {
    setFormData({ ...formData, mechanicId });
    if (scheduleOptions.enableScheduling && scheduleOptions.scheduledDate) {
      loadAvailableSlots(mechanicId, scheduleOptions.scheduledDate);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.mechanicId || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate scheduling if enabled
    if (scheduleOptions.enableScheduling) {
      if (!scheduleOptions.scheduledDate || !scheduleOptions.startTime) {
        toast.error('Please select both date and time for scheduling');
        return;
      }
    }

    try {
      const workOrderId = await createWorkOrder(formData);
      
      // Create schedule if enabled
      if (scheduleOptions.enableScheduling) {
        const [hour, minute] = scheduleOptions.startTime.split(':').map(Number);
        const endHour = hour + Math.floor(scheduleOptions.duration / 60);
        const endMinute = minute + (scheduleOptions.duration % 60);
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

        await createSchedule({
          workOrderId: workOrderId,
          mechanicId: formData.mechanicId,
          scheduledDate: scheduleOptions.scheduledDate,
          startTime: scheduleOptions.startTime,
          endTime: endTime,
          duration: scheduleOptions.duration,
          notes: scheduleOptions.notes
        });
        
        toast.success('Work order created and scheduled successfully');
      } else {
        toast.success('Work order created successfully');
      }
      
      navigate(`/work-orders/${workOrderId}`);
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error('Failed to create work order');
    }
  };

  if (loading) {
    return <div className="loading">Loading form data...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create New Work Order</h1>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/work-orders')}
        >
          Cancel
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Work Order Details</h3>
        </div>        <form onSubmit={handleSubmit} className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="customerId">Customer *</label>
              <select
                id="customerId"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
              >
                <option value="">Select Customer...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="form-help text-gray">
                  No customers found. <Link to="/customers" className="text-green">Add customers first</Link>.
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="mechanicId">Assigned Mechanic *</label>
              <select
                id="mechanicId"
                value={formData.mechanicId}
                onChange={(e) => handleMechanicChange(e.target.value)}
                required
              >
                <option value="">Select Mechanic...</option>
                {mechanics.map(mechanic => (
                  <option key={mechanic.id} value={mechanic.id}>
                    {mechanic.name} - {mechanic.specialty || 'General'}
                  </option>
                ))}
              </select>
              {mechanics.length === 0 && (
                <p className="form-help text-gray">
                  No mechanics found. <Link to="/mechanics" className="text-green">Add mechanics first</Link>.
                </p>
              )}
            </div>
          </div><div className="form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              placeholder="Describe the gearbox repair work needed..."
              required
            />
          </div>          {/* Optional Scheduling Section */}
          <div className="form-section mb-6">
            <div className="form-section-header mb-4">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={scheduleOptions.enableScheduling}
                  onChange={(e) => handleScheduleOptionChange('enableScheduling', e.target.checked)}
                />
                Schedule this job
              </label>
              <p className="form-help text-gray">
                Optionally schedule this job for a specific date and time
              </p>
            </div>

            {scheduleOptions.enableScheduling && (
              <div className="scheduling-options">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label htmlFor="scheduledDate">Date *</label>
                    <input
                      type="date"
                      id="scheduledDate"
                      value={scheduleOptions.scheduledDate}
                      onChange={(e) => handleScheduleOptionChange('scheduledDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duration">Duration (minutes)</label>
                    <select
                      id="duration"
                      value={scheduleOptions.duration}
                      onChange={(e) => handleScheduleOptionChange('duration', parseInt(e.target.value))}
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                      <option value={240}>4 hours</option>
                      <option value={480}>8 hours (Full day)</option>
                    </select>
                  </div>
                </div>                {availableSlots.length > 0 && (
                  <div className="form-group mb-4">
                    <label>Available Time Slots</label>
                    <div className="time-slots-grid">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          className={`time-slot ${scheduleOptions.startTime === slot.time ? 'selected' : ''}`}
                          onClick={() => handleScheduleOptionChange('startTime', slot.time)}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {scheduleOptions.scheduledDate && formData.mechanicId && availableSlots.length === 0 && (
                  <div className="empty-state mb-4">
                    <p>No available time slots for the selected date and mechanic.</p>
                    <p>Try selecting a different date or mechanic.</p>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="scheduleNotes">Schedule Notes</label>
                  <textarea
                    id="scheduleNotes"
                    value={scheduleOptions.notes}
                    onChange={(e) => handleScheduleOptionChange('notes', e.target.value)}
                    rows="2"
                    placeholder="Additional notes for the scheduled appointment..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="btn-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={customers.length === 0 || mechanics.length === 0}
            >
              Create Work Order
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/work-orders')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {(customers.length === 0 || mechanics.length === 0) && (
        <div className="card bg-green-50 border-green">
          <div className="card-content">
            <h4 className="text-green-600 font-semibold mb-2">Setup Required</h4>
            <p className="text-green-600 mb-2">
              Before creating work orders, you need to:
            </p>
            <ul className="text-green-600 ml-4">
              {customers.length === 0 && (
                <li>
                  <Link to="/customers" className="text-green">Add at least one customer</Link>
                </li>
              )}
              {mechanics.length === 0 && (
                <li>
                  <Link to="/mechanics" className="text-green">Add at least one mechanic</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkOrderNewPage;
