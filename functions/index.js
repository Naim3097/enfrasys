const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Example Cloud Function for sending low stock notifications
exports.checkLowStock = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.firestore();
  
  try {
    const partsSnapshot = await db.collection('parts').where('currentStock', '<', 5).get();
    
    if (!partsSnapshot.empty) {
      console.log(`Found ${partsSnapshot.size} parts with low stock`);
      
      // Here you could send notifications, emails, etc.
      const lowStockParts = [];
      partsSnapshot.forEach(doc => {
        lowStockParts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('Low stock parts:', lowStockParts);
      
      // TODO: Implement notification logic (email, SMS, etc.)
    }
  } catch (error) {
    console.error('Error checking low stock:', error);
  }
  
  return null;
});

// Example function to validate stock before invoice creation
exports.validateStock = functions.firestore
  .document('invoices/{invoiceId}')
  .onCreate(async (snap, context) => {
    const invoice = snap.data();
    const db = admin.firestore();
    
    try {
      // Check if there's sufficient stock for all items
      for (const item of invoice.items) {
        const partDoc = await db.collection('parts').doc(item.partId).get();
        if (partDoc.exists) {
          const part = partDoc.data();
          if (part.currentStock < item.qty) {
            console.warn(`Insufficient stock for part ${item.partName}: requested ${item.qty}, available ${part.currentStock}`);
          }
        }
      }
    } catch (error) {
      console.error('Error validating stock:', error);
    }
    
    return null;
  });

// Health check function
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Sparepart Management System Cloud Functions are running'
  });
});
