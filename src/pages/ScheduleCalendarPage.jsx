import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  getSchedulesByDate, 
  getWorkOrders, 
  getCustomers, 
  getMechanics,
  getScheduleMetrics,
  createSchedule
  // updateSchedule, // TODO: Will be used for future edit functionality
  // deleteSchedule  // TODO: Will be used for future delete functionality
} from '../services/dataService';
import CalendarGrid from '../components/CalendarGrid';
import JobScheduleCard from '../components/JobScheduleCard';
import { toast } from 'react-toastify';

function ScheduleCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
  const [schedules, setSchedules] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [scheduleMetrics, setScheduleMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const getDateRange = useCallback(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    if (viewMode === 'week') {
      // Get start of week (Monday)
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      
      // Get end of week (Sunday)
      end.setDate(start.getDate() + 6);
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }, [currentDate, viewMode]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      
      const [schedulesData, workOrdersData, customersData, mechanicsData, metricsData] = await Promise.all([
        getSchedulesByDate(startDate, endDate),
        getWorkOrders(),
        getCustomers(),
        getMechanics(),
        getScheduleMetrics(startDate, endDate)
      ]);
      
      setSchedules(schedulesData);
      setWorkOrders(workOrdersData);
      setCustomers(customersData);
      setMechanics(mechanicsData);
      setScheduleMetrics(metricsData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const handleTimeSlotClick = (date, time, mechanicId) => {
    setSelectedSlot({ date, time, mechanicId });
    setSelectedMechanic(mechanicId);
    setShowScheduleModal(true);
  };

  const handleScheduleJob = async (e) => {
    e.preventDefault();
    
    if (!selectedWorkOrder || !selectedMechanic || !selectedSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Calculate end time (assuming 1-hour default duration)
      const [hour, minute] = selectedSlot.time.split(':').map(Number);
      const endHour = hour + 1;
      const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      await createSchedule({
        workOrderId: selectedWorkOrder,
        mechanicId: selectedMechanic,
        scheduledDate: selectedSlot.date,
        startTime: selectedSlot.time,
        endTime: endTime,
        duration: 60,
        notes: scheduleNotes
      });

      toast.success('Job scheduled successfully');
      setShowScheduleModal(false);
      setSelectedWorkOrder('');
      setSelectedMechanic('');
      setScheduleNotes('');
      setSelectedSlot(null);
      loadData();
    } catch (error) {
      console.error('Error scheduling job:', error);
      toast.error(error.message || 'Failed to schedule job');
    }
  };

  const getUnscheduledWorkOrders = () => {
    const scheduledWorkOrderIds = schedules.map(s => s.workOrderId);
    return workOrders.filter(wo => 
      !scheduledWorkOrderIds.includes(wo.id) && 
      wo.status !== 'Completed'
    );
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getMechanicName = (mechanicId) => {
    const mechanic = mechanics.find(m => m.id === mechanicId);
    return mechanic ? mechanic.name : 'Unknown Mechanic';
  };

  const formatDateDisplay = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else {
      const { startDate, endDate } = getDateRange();
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  if (loading) {
    return <div className="loading">Loading schedule calendar...</div>;
  }
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Job Schedule Calendar</h1>
        <div className="flex gap-2 items-center">
          <div className="btn-group">
            <button 
              className={`btn ${viewMode === 'day' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button 
              className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
          <Link to="/work-orders/new" className="btn btn-primary">
            + New Work Order
          </Link>
        </div>
      </div>      {/* Calendar Navigation */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="btn btn-secondary"
              onClick={() => navigateDate(-1)}
            >
              ← {viewMode === 'day' ? 'Previous Day' : 'Previous Week'}
            </button>
            <h3 className="card-title m-0">
              {formatDateDisplay()}
            </h3>
            <button 
              className="btn btn-secondary"
              onClick={() => navigateDate(1)}
            >
              {viewMode === 'day' ? 'Next Day' : 'Next Week'} →
            </button>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
        </div>
      </div>      {/* Schedule Metrics */}
      {scheduleMetrics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number text-green">
              {scheduleMetrics.totalScheduled}
            </div>
            <div className="stat-label">Scheduled Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-green">
              {scheduleMetrics.totalCancelled}
            </div>
            <div className="stat-label">Cancelled</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-green">
              {getUnscheduledWorkOrders().length}
            </div>
            <div className="stat-label">Unscheduled</div>
          </div>
          <div className="stat-card">
            <div className="stat-number text-purple">
              {mechanics.length}
            </div>
            <div className="stat-label">Available Mechanics</div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="card">
        <CalendarGrid
          viewMode={viewMode}
          currentDate={currentDate}
          schedules={schedules}
          mechanics={mechanics}
          workOrders={workOrders}
          customers={customers}
          onTimeSlotClick={handleTimeSlotClick}
          onScheduleUpdate={loadData}
        />
      </div>      {/* Unscheduled Work Orders */}
      {getUnscheduledWorkOrders().length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Unscheduled Work Orders ({getUnscheduledWorkOrders().length})</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getUnscheduledWorkOrders().map(workOrder => (
              <JobScheduleCard
                key={workOrder.id}
                workOrder={workOrder}
                customer={customers.find(c => c.id === workOrder.customerId)}
                mechanic={mechanics.find(m => m.id === workOrder.mechanicId)}
                onSchedule={() => {
                  setSelectedWorkOrder(workOrder.id);
                  setSelectedMechanic(workOrder.mechanicId);
                  setShowScheduleModal(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule Work Order</h3>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowScheduleModal(false)}
              >
                ×
              </button>
            </div>            <form onSubmit={handleScheduleJob}>
              <div className="modal-body">
                {selectedSlot && (
                  <div className="mb-4 p-4 bg-gray-50 rounded">
                    <strong>Selected Time Slot:</strong><br />
                    {new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot.time}
                    {selectedSlot.mechanicId && (
                      <span> - {getMechanicName(selectedSlot.mechanicId)}</span>
                    )}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="workOrder">Work Order *</label>
                  <select
                    id="workOrder"
                    value={selectedWorkOrder}
                    onChange={(e) => setSelectedWorkOrder(e.target.value)}
                    required
                  >
                    <option value="">Select work order...</option>
                    {getUnscheduledWorkOrders().map(wo => (
                      <option key={wo.id} value={wo.id}>
                        {getCustomerName(wo.customerId)} - {wo.description.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="mechanic">Mechanic *</label>
                  <select
                    id="mechanic"
                    value={selectedMechanic}
                    onChange={(e) => setSelectedMechanic(e.target.value)}
                    required
                  >
                    <option value="">Select mechanic...</option>
                    {mechanics.map(mechanic => (
                      <option key={mechanic.id} value={mechanic.id}>
                        {mechanic.name} - {mechanic.specialty || 'General'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Schedule Notes</label>
                  <textarea
                    id="notes"
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    rows="3"
                    placeholder="Any special instructions or notes for this scheduled job..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Schedule Job
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleCalendarPage;
