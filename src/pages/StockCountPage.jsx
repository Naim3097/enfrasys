import React, { useState, useEffect } from 'react';
import { getParts, submitStockCount } from '../services/dataService';
import { toast } from 'react-toastify';

function StockCountPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countData, setCountData] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const partsData = await getParts();
      setParts(partsData);
      // Initialize count data with current stock
      setCountData(partsData.map(part => ({
        partId: part.id,
        partName: part.name,
        sku: part.sku,
        currentStock: part.currentStock,
        countedQty: part.currentStock
      })));
    } catch (error) {
      console.error('Error loading parts:', error);
      toast.error('Failed to load parts');
    } finally {
      setLoading(false);
    }
  };

  const updateCount = (partId, countedQty) => {
    setCountData(prevData =>
      prevData.map(item =>
        item.partId === partId
          ? { ...item, countedQty: parseInt(countedQty) || 0 }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit this stock count? This will update all stock levels.')) {
      try {
        setSubmitting(true);
        const stockCountData = {
          items: countData.map(item => ({
            partId: item.partId,
            partName: item.partName,
            countedQty: item.countedQty
          }))
        };

        await submitStockCount(stockCountData);
        toast.success('Stock count submitted successfully');
        loadParts(); // Reload to get updated stock levels
      } catch (error) {
        console.error('Error submitting stock count:', error);
        toast.error('Failed to submit stock count');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const resetCounts = () => {
    if (window.confirm('Are you sure you want to reset all counts to current stock levels?')) {
      setCountData(parts.map(part => ({
        partId: part.id,
        partName: part.name,
        sku: part.sku,
        currentStock: part.currentStock,
        countedQty: part.currentStock
      })));
    }
  };

  const clearAllCounts = () => {
    if (window.confirm('Are you sure you want to clear all counts to zero?')) {
      setCountData(prevData =>
        prevData.map(item => ({ ...item, countedQty: 0 }))
      );
    }
  };

  const getVariance = (currentStock, countedQty) => {
    return countedQty - currentStock;
  };

  const getTotalVariances = () => {
    return countData.reduce((acc, item) => {
      const variance = getVariance(item.currentStock, item.countedQty);
      if (variance > 0) acc.positive += variance;
      if (variance < 0) acc.negative += Math.abs(variance);
      return acc;
    }, { positive: 0, negative: 0 });
  };

  if (loading) {
    return <div className="loading">Loading stock count...</div>;
  }

  const variances = getTotalVariances();
  const hasChanges = countData.some(item => item.currentStock !== item.countedQty);
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Stock Count</h1>
        <div className="btn-group">
          <button 
            className="btn btn-secondary" 
            onClick={clearAllCounts}
          >
            Clear All
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={resetCounts}
          >
            Reset to Current
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={submitting || !hasChanges}
          >
            {submitting ? 'Submitting...' : 'Submit Count'}
          </button>
        </div>
      </div>

      {(variances.positive > 0 || variances.negative > 0) && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="card-header">
            <h4 className="font-semibold">Stock Variance Summary</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-green-600 font-semibold">Positive Variance</div>
              <div className="text-2xl font-bold text-green-600">+{variances.positive}</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-semibold">Negative Variance</div>
              <div className="text-2xl font-bold text-red-600">-{variances.negative}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Physical Stock Count</h3>
          <p className="card-subtitle">Enter the actual counted quantity for each part. Differences will be highlighted.</p>
        </div>
        {parts.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>SKU</th>
                  <th className="text-center">System Stock</th>
                  <th className="text-center">Counted Qty</th>
                  <th className="text-center">Variance</th>
                </tr>
              </thead>
              <tbody>
                {countData.map((item) => {
                  const variance = getVariance(item.currentStock, item.countedQty);
                  const hasVariance = variance !== 0;
                  
                  return (
                    <tr 
                      key={item.partId} 
                      className={hasVariance ? 'bg-yellow-50' : ''}
                    >
                      <td className="font-semibold">{item.partName}</td>
                      <td className="text-gray">{item.sku}</td>
                      <td className="text-center">{item.currentStock}</td>
                      <td className="text-center">
                        <input
                          type="number"
                          value={item.countedQty}
                          onChange={(e) => updateCount(item.partId, e.target.value)}
                          min="0"
                          className="form-control text-center w-20"
                        />
                      </td>
                      <td className="text-center">
                        <span 
                          className={`font-semibold ${
                            variance > 0 ? 'text-green-600' : 
                            variance < 0 ? 'text-red-600' : 
                            'text-gray'
                          }`}
                        >
                          {variance > 0 ? `+${variance}` : variance}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h4>No Parts Available</h4>
            <p className="text-gray">Add parts to your inventory first before performing a stock count.</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="font-semibold">Instructions</h4>
        </div>
        <ul className="list-disc pl-6 space-y-2 text-gray">
          <li>Count the physical quantity of each part in your inventory</li>
          <li>Enter the counted quantity in the "Counted Qty" column</li>
          <li>Variances (differences between system stock and counted qty) will be highlighted</li>
          <li>Positive variances (+) indicate more stock than recorded</li>
          <li>Negative variances (-) indicate less stock than recorded</li>
          <li>Review all variances before submitting</li>
          <li>Submitting will update all stock levels to the counted quantities</li>
        </ul>
      </div>
    </div>
  );
}

export default StockCountPage;
