import React from 'react';

function CalendarGrid({ 
  viewMode, 
  currentDate, 
  schedules, 
  mechanics, 
  workOrders, 
  customers, 
  onTimeSlotClick, 
  onScheduleUpdate 
}) {
  const timeSlots = generateTimeSlots();
  
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }

  const getDaysToDisplay = () => {
    if (viewMode === 'day') {
      return [currentDate];
    } else {
      const days = [];
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
      startOfWeek.setDate(diff);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push(date);
      }
      return days;
    }
  };

  const getSchedulesForSlot = (date, time, mechanicId = null) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(schedule => {
      const matchesDate = schedule.scheduledDate === dateStr;
      const matchesTime = schedule.startTime <= time && schedule.endTime > time;
      const matchesMechanic = mechanicId ? schedule.mechanicId === mechanicId : true;
      const isActive = schedule.status !== 'cancelled';
      
      return matchesDate && matchesTime && matchesMechanic && isActive;
    });
  };

  const getWorkOrderById = (workOrderId) => {
    return workOrders.find(wo => wo.id === workOrderId);
  };

  const getCustomerById = (customerId) => {
    return customers.find(c => c.id === customerId);
  };

  const getMechanicById = (mechanicId) => {
    return mechanics.find(m => m.id === mechanicId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Requested':
        return '#f5f5f5';
      case 'In Progress':
        return '#e3f2fd';
      case 'Completed':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Requested':
        return '#666';
      case 'In Progress':
        return '#1976d2';
      case 'Completed':
        return '#f57c00';
      default:
        return '#666';
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const daysToDisplay = getDaysToDisplay();

  if (viewMode === 'day') {
    // Daily view - single day with all mechanics
    return (
      <div className="calendar-grid">
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(' + mechanics.length + ', 1fr)', gap: '1px', backgroundColor: '#dee2e6' }}>
          {/* Header row */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '0.5rem', fontWeight: 'bold', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
            Time
          </div>
          {mechanics.map(mechanic => (
            <div 
              key={mechanic.id}
              style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '0.5rem', 
                fontWeight: 'bold', 
                textAlign: 'center',
                borderBottom: '2px solid #dee2e6'
              }}
            >
              {mechanic.name}
              <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#666' }}>
                {mechanic.specialty || 'General'}
              </div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              {/* Time label */}
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '0.5rem', 
                fontSize: '0.875rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {formatTime(time)}
              </div>
              
              {/* Mechanic slots */}
              {mechanics.map(mechanic => {
                const slotSchedules = getSchedulesForSlot(currentDate, time, mechanic.id);
                const hasSchedule = slotSchedules.length > 0;
                
                return (
                  <div
                    key={`${mechanic.id}-${time}`}
                    style={{
                      backgroundColor: hasSchedule ? getStatusColor(getWorkOrderById(slotSchedules[0]?.workOrderId)?.status) : '#ffffff',
                      padding: '0.25rem',
                      minHeight: '40px',
                      cursor: hasSchedule ? 'pointer' : 'pointer',
                      border: hasSchedule ? '2px solid #1976d2' : '1px solid #dee2e6',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => {
                      if (!hasSchedule) {
                        onTimeSlotClick(currentDate.toISOString().split('T')[0], time, mechanic.id);
                      }
                    }}
                    title={hasSchedule ? 
                      `${getCustomerById(getWorkOrderById(slotSchedules[0].workOrderId)?.customerId)?.name} - ${getWorkOrderById(slotSchedules[0].workOrderId)?.description.substring(0, 50)}...` :
                      'Click to schedule'
                    }
                  >
                    {hasSchedule && (
                      <div style={{ 
                        fontSize: '0.75rem', 
                        textAlign: 'center',
                        color: getStatusTextColor(getWorkOrderById(slotSchedules[0].workOrderId)?.status),
                        fontWeight: 'bold'
                      }}>
                        {getCustomerById(getWorkOrderById(slotSchedules[0].workOrderId)?.customerId)?.name?.substring(0, 15)}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  } else {
    // Weekly view - 7 days with combined mechanic schedules
    return (
      <div className="calendar-grid">
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '1px', backgroundColor: '#dee2e6' }}>
          {/* Header row */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '0.5rem', fontWeight: 'bold', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>
            Time
          </div>
          {daysToDisplay.map(date => (
            <div 
              key={date.toISOString()}
              style={{ 
                backgroundColor: isWeekend(date) ? '#fff3e0' : '#f8f9fa', 
                padding: '0.5rem', 
                fontWeight: 'bold', 
                textAlign: 'center',
                borderBottom: '2px solid #dee2e6'
              }}
            >
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
              <div style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              {/* Time label */}
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '0.5rem', 
                fontSize: '0.875rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {formatTime(time)}
              </div>
              
              {/* Day slots */}
              {daysToDisplay.map(date => {
                const slotSchedules = getSchedulesForSlot(date, time);
                const hasSchedules = slotSchedules.length > 0;
                
                return (
                  <div
                    key={`${date.toISOString()}-${time}`}
                    style={{
                      backgroundColor: isWeekend(date) ? '#fafafa' : '#ffffff',
                      padding: '0.25rem',
                      minHeight: '40px',
                      cursor: 'pointer',
                      border: '1px solid #dee2e6',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => onTimeSlotClick(date.toISOString().split('T')[0], time)}
                    title={hasSchedules ? 
                      `${slotSchedules.length} job(s) scheduled` :
                      'Click to schedule'
                    }
                  >
                    {hasSchedules && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {slotSchedules.slice(0, 2).map((schedule, index) => {
                          const workOrder = getWorkOrderById(schedule.workOrderId);
                          const customer = getCustomerById(workOrder?.customerId);
                          const mechanic = getMechanicById(schedule.mechanicId);
                          
                          return (
                            <div
                              key={schedule.id}
                              style={{
                                backgroundColor: getStatusColor(workOrder?.status),
                                color: getStatusTextColor(workOrder?.status),
                                padding: '2px 4px',
                                borderRadius: '2px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                border: '1px solid',
                                borderColor: getStatusTextColor(workOrder?.status)
                              }}
                            >
                              {customer?.name?.substring(0, 8)} - {mechanic?.name?.substring(0, 5)}
                            </div>
                          );
                        })}
                        {slotSchedules.length > 2 && (
                          <div style={{ fontSize: '0.6rem', textAlign: 'center', color: '#666' }}>
                            +{slotSchedules.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
}

export default CalendarGrid;
