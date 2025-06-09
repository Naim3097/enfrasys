// Schedule Test Helper for Phase 2 Testing
// Run in browser console: window.createTestSchedule()

const createTestSchedule = async () => {
  console.log('🗓️ Creating test schedule data...');
  
  try {
    // Get data service functions
    const { 
      createWorkOrder, 
      createCustomer, 
      createMechanic, 
      createSchedule,
      getWorkOrders,
      getMechanics 
    } = window.dataService || {};
    
    if (!createWorkOrder) {
      console.error('❌ Data service not available');
      return;
    }

    // Create test customer
    const customerId = await createCustomer({
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '(555) 123-4567',
      address: '123 Test St, Test City, TC 12345'
    });
    console.log('✅ Created test customer');

    // Create test mechanic if none exist
    const mechanics = await getMechanics();
    let mechanicId;
    if (mechanics.length === 0) {
      mechanicId = await createMechanic({
        name: 'John Mechanic',
        email: 'john@example.com',
        phone: '(555) 987-6543',
        specialties: ['Engine', 'Transmission']
      });
      console.log('✅ Created test mechanic');
    } else {
      mechanicId = mechanics[0].id;
      console.log('✅ Using existing mechanic');
    }

    // Create test work order
    const workOrderId = await createWorkOrder({
      customerId,
      description: 'Engine maintenance and oil change',
      category: 'Maintenance',
      priority: 'medium',
      estimatedCost: 150.00,
      items: [
        { partId: 'test-part-1', qty: 1, description: 'Engine Oil', price: 25.00 },
        { partId: null, qty: 2, description: 'Labor Hours', price: 75.00 }
      ]
    });
    console.log('✅ Created test work order');

    // Create today's schedule
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const scheduleId = await createSchedule({
      workOrderId,
      mechanicId,
      date: todayStr,
      startTime: '10:00',
      duration: 120, // 2 hours
      status: 'scheduled',
      notes: 'Test schedule for Phase 2 demonstration'
    });
    console.log('✅ Created test schedule for today');

    console.log(`
🎉 Test data created successfully!
- Customer ID: ${customerId}
- Work Order ID: ${workOrderId}
- Schedule ID: ${scheduleId}
- Scheduled for: ${todayStr} at 10:00 AM

Refresh the dashboard to see the schedule metrics and today's appointments!
    `);

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
};

// Make available globally for console use
if (typeof window !== 'undefined') {
  window.createTestSchedule = createTestSchedule;
}

export { createTestSchedule };
