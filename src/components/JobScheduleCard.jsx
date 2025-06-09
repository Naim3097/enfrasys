import React from 'react';
import { Link } from 'react-router-dom';

function JobScheduleCard({ workOrder, customer, mechanic, onSchedule, schedule }) {  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Requested':
        return { backgroundColor: '#f5f5f5', color: '#666' };
      case 'In Progress':
        return { backgroundColor: 'var(--light-green-bg)', color: 'var(--deep-teal-green)' };
      case 'Completed':
        return { backgroundColor: 'var(--light-green-bg)', color: 'var(--deep-teal-green)' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666' };
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="job-schedule-card" style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 'bold' }}>
            {customer?.name || 'Unknown Customer'}
          </h4>
          <span 
            className="status-badge" 
            style={{
              ...getStatusBadgeStyle(workOrder.status),
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            {workOrder.status}
          </span>
        </div>
        {schedule && (
          <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#666' }}>
            <div style={{ fontWeight: 'bold' }}>{formatDate(schedule.scheduledDate)}</div>
            <div>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</div>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '0.875rem', 
          color: '#333',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {workOrder.description}
        </p>
      </div>

      {/* Mechanic Info */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          <strong>Assigned to:</strong> {mechanic?.name || 'Unassigned'}
          {mechanic?.specialty && (            <span style={{ 
              marginLeft: '0.5rem', 
              padding: '0.125rem 0.375rem',
              backgroundColor: 'var(--light-green-bg)',
              color: 'var(--deep-teal-green)',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              {mechanic.specialty}
            </span>
          )}
        </div>
        {customer?.vehicleDetails && (
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
            <strong>Vehicle:</strong> {customer.vehicleDetails}
          </div>
        )}
      </div>

      {/* Schedule Info */}
      {schedule && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#333' }}>
            📅 Scheduled Details
          </div>
          <div style={{ color: '#666' }}>
            <div><strong>Date:</strong> {formatDate(schedule.scheduledDate)}</div>
            <div><strong>Time:</strong> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</div>
            <div><strong>Duration:</strong> {schedule.duration} minutes</div>
            {schedule.notes && (
              <div style={{ marginTop: '0.25rem' }}>
                <strong>Notes:</strong> {schedule.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <Link 
          to={`/work-orders/${workOrder.id}`}
          className="btn btn-sm btn-secondary"
          style={{ flex: 1, textAlign: 'center' }}
        >
          View Details
        </Link>        {!schedule && onSchedule && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={(e) => {
              e.preventDefault();
              onSchedule();
            }}
            style={{ flex: 1 }}
          >
            Schedule
          </button>
        )}
        {schedule && (
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={(e) => {
              e.preventDefault();
              // Could trigger reschedule modal here
            }}
            style={{ flex: 1 }}
          >
            Reschedule
          </button>
        )}
      </div>

      {/* Created Date */}
      <div style={{ 
        marginTop: '0.75rem', 
        fontSize: '0.75rem', 
        color: '#999', 
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '0.5rem'
      }}>
        Created: {new Date(workOrder.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export default JobScheduleCard;
