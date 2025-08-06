'use client';

import { useState, useEffect } from 'react';

export default function CartPage() {
  const [calculatorData, setCalculatorData] = useState(null);
  const [materialData, setMaterialData] = useState(null);

  useEffect(() => {
    console.log('Cart component mounted!');
    
    // Get data from localStorage
    const calc = localStorage.getItem('pendingCalculatorOrder');
    const mats = localStorage.getItem('materialOrders');
    
    console.log('Found calculator data:', calc);
    console.log('Found materials data:', mats);
    
    if (calc) setCalculatorData(calc);
    if (mats) setMaterialData(mats);
  }, []);

  return (
    <div style={{ padding: '50px', fontFamily: 'monospace', background: '#EFEEE1', minHeight: '100vh' }}>
      <h1>Cart Debug Test</h1>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white' }}>
        <h2>Calculator Data:</h2>
        <pre>{calculatorData || 'No calculator data found'}</pre>
      </div>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white' }}>
        <h2>Materials Data:</h2>
        <pre>{materialData || 'No materials data found'}</pre>
      </div>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#ffffcc' }}>
        <p>If you see data above, the cart is working!</p>
        <p>If not, check the console for errors.</p>
      </div>
    </div>
  );
}