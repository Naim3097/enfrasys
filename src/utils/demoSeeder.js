// Demo data seeder for testing the sparepart management system
// Run this in the browser console when the app is running to add sample data

const seedDemoData = async () => {
  console.log('🌱 Seeding demo data...');
  
  try {
    // Import the data service functions
    const { createSupplier, createPart } = window.dataService || {};
    
    if (!createSupplier || !createPart) {
      console.error('❌ Data service not available. Make sure the app is running.');
      return;
    }

    // Demo suppliers
    const suppliers = [
      {
        name: 'AutoParts Express',
        contact: 'John Smith - (555) 123-4567',
        address: '123 Industrial Blvd, Detroit, MI 48201'
      },
      {
        name: 'Premium Components Ltd',
        contact: 'Sarah Johnson - (555) 987-6543',
        address: '456 Manufacturing Dr, Cleveland, OH 44101'
      },
      {
        name: 'Global Parts Supply',
        contact: 'Mike Wilson - (555) 555-0123',
        address: '789 Commerce St, Chicago, IL 60601'
      }
    ];

    console.log('📦 Creating suppliers...');
    const supplierIds = [];
    for (const supplier of suppliers) {
      const id = await createSupplier(supplier);
      supplierIds.push(id);
      console.log(`✅ Created supplier: ${supplier.name}`);
    }

    // Demo parts
    const parts = [
      {
        name: 'Engine Oil Filter',
        sku: 'OF-001',
        unitPrice: 12.99,
        currentStock: 50
      },
      {
        name: 'Brake Pads - Front',
        sku: 'BP-F001',
        unitPrice: 45.50,
        currentStock: 25
      },
      {
        name: 'Air Filter',
        sku: 'AF-001',
        unitPrice: 18.75,
        currentStock: 30
      },
      {
        name: 'Spark Plugs (Set of 4)',
        sku: 'SP-004',
        unitPrice: 28.99,
        currentStock: 15
      },
      {
        name: 'Transmission Fluid',
        sku: 'TF-001',
        unitPrice: 22.50,
        currentStock: 8
      },
      {
        name: 'Radiator Coolant',
        sku: 'RC-001',
        unitPrice: 16.25,
        currentStock: 3
      },
      {
        name: 'Timing Belt',
        sku: 'TB-001',
        unitPrice: 65.00,
        currentStock: 12
      },
      {
        name: 'Fuel Pump',
        sku: 'FP-001',
        unitPrice: 125.00,
        currentStock: 2
      }
    ];

    console.log('🔧 Creating parts...');
    for (const part of parts) {
      await createPart(part);
      console.log(`✅ Created part: ${part.name} (Stock: ${part.currentStock})`);
    }

    console.log('🎉 Demo data seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${suppliers.length} suppliers created`);
    console.log(`   - ${parts.length} parts created`);
    console.log('   - Some parts have low stock (< 5) to test alerts');
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
};

// Instructions for use
console.log(`
🌱 Demo Data Seeder Ready!

To add sample data to your sparepart management system:

1. Make sure you're logged into the application
2. Run this command in the browser console:
   seedDemoData()

This will create:
- 3 sample suppliers
- 8 sample parts (some with low stock for testing alerts)

Note: This only works with the Firebase emulator for safety.
`);

// Export for potential use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { seedDemoData };
}

// Make available globally for console use
if (typeof window !== 'undefined') {
  window.seedDemoData = seedDemoData;
}
