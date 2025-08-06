'use client';

import { useState, useEffect } from 'react';

export default function CartPage() {
  const [calculatorItems, setCalculatorItems] = useState([]);
  const [materialItems, setMaterialItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load calculator configuration
    const calcConfig = localStorage.getItem('pendingCalculatorOrder');
    if (calcConfig) {
      try {
        const parsed = JSON.parse(calcConfig);
        setCalculatorItems([parsed]);
      } catch (e) {
        console.error('Error parsing calculator data:', e);
      }
    }

    // Load material selections
    const materials = localStorage.getItem('materialOrders');
    if (materials) {
      try {
        const parsed = JSON.parse(materials);
        setMaterialItems(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (e) {
        console.error('Error parsing materials data:', e);
      }
    }

    setLoading(false);
  }, []);

  const removeCalculatorItem = (index) => {
    setCalculatorItems([]);
    localStorage.removeItem('pendingCalculatorOrder');
  };

  const removeMaterialItem = (index) => {
    const newItems = materialItems.filter((_, i) => i !== index);
    setMaterialItems(newItems);
    if (newItems.length === 0) {
      localStorage.removeItem('materialOrders');
    } else {
      localStorage.setItem('materialOrders', JSON.stringify(newItems));
    }
  };

  const calculateTotal = () => {
    let total = 0;
    calculatorItems.forEach(item => {
      total += item.estimatedCost || 0;
    });
    materialItems.forEach(item => {
      total += (item.price || 0) * (item.quantity || 1);
    });
    return total;
  };

  const clearCart = () => {
    localStorage.removeItem('pendingCalculatorOrder');
    localStorage.removeItem('materialOrders');
    setCalculatorItems([]);
    setMaterialItems([]);
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', minHeight: '100vh', background: '#EFEEE1' }}>
        <p>Loading cart...</p>
      </div>
    );
  }

  const isEmpty = calculatorItems.length === 0 && materialItems.length === 0;

  if (isEmpty) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center', 
        minHeight: '100vh', 
        background: '#EFEEE1',
        fontFamily: "'Roboto Mono', monospace"
      }}>
        <h1 style={{ color: '#232320', marginBottom: '20px' }}>YOUR CART IS EMPTY</h1>
        <p style={{ color: '#A1A2A0', marginBottom: '30px' }}>
          Configure a wall system or browse our materials to get started.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.location.href = '/calculator'}
            style={{
              background: '#34499E',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              cursor: 'pointer',
              fontSize: '14px',
              letterSpacing: '2px'
            }}
          >
            WALL CALCULATOR
          </button>
          <button 
            onClick={() => window.location.href = '/materials'}
            style={{
              background: '#232320',
              color: '#EFEEE1',
              border: 'none',
              padding: '15px 30px',
              cursor: 'pointer',
              fontSize: '14px',
              letterSpacing: '2px'
            }}
          >
            BROWSE MATERIALS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '100vh',
      background: '#EFEEE1',
      fontFamily: "'Roboto Mono', monospace"
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: '#232320',
          letterSpacing: '4px'
        }}>
          SHOPPING CART
        </h1>

        {/* Calculator Items */}
        {calculatorItems.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              marginBottom: '20px',
              color: '#232320',
              borderBottom: '2px solid #232320',
              paddingBottom: '10px'
            }}>
              WALL CONFIGURATIONS
            </h2>
            
            {calculatorItems.map((item, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '20px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <div>
                  <h3 style={{ marginBottom: '10px', color: '#232320' }}>
                    {item.projectName || 'Wall Configuration'}
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Height: {item.wallHeight}" | 
                    Coverage: {item.coverageType} | 
                    Profile: {item.profile} | 
                    Material: {item.boardMaterial}
                  </p>
                  <p style={{ marginTop: '10px', fontSize: '18px', color: '#34499E', fontWeight: 'bold' }}>
                    ${(item.estimatedCost || 0).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => removeCalculatorItem(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    fontSize: '20px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Material Items */}
        {materialItems.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '18px',
              marginBottom: '20px',
              color: '#232320',
              borderBottom: '2px solid #232320',
              paddingBottom: '10px'
            }}>
              MATERIALS
            </h2>
            
            {materialItems.map((item, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '20px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <div>
                  <h3 style={{ marginBottom: '10px', color: '#232320' }}>
                    {item.name}
                  </h3>
                  {item.description && (
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                      {item.description}
                    </p>
                  )}
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Quantity: {item.quantity || 1}
                  </p>
                  <p style={{ marginTop: '10px', fontSize: '18px', color: '#34499E', fontWeight: 'bold' }}>
                    ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => removeMaterialItem(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    fontSize: '20px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cart Total */}
        <div style={{
          background: '#232320',
          color: '#EFEEE1',
          padding: '30px',
          marginTop: '40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '20px', letterSpacing: '2px' }}>
              ESTIMATED TOTAL
            </h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#B19359' }}>
              ${calculateTotal().toLocaleString()}
            </p>
          </div>
          
          <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '20px' }}>
            * Final pricing will be confirmed after design review
          </p>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={clearCart}
              style={{
                flex: 1,
                background: 'transparent',
                color: '#EFEEE1',
                border: '2px solid #EFEEE1',
                padding: '15px',
                cursor: 'pointer',
                fontSize: '14px',
                letterSpacing: '2px'
              }}
            >
              CLEAR CART
            </button>
            
            <button
              onClick={() => alert('Checkout coming soon! For now, please call 215.721.9331')}
              style={{
                flex: 2,
                background: '#B19359',
                color: '#232320',
                border: 'none',
                padding: '15px',
                cursor: 'pointer',
                fontSize: '14px',
                letterSpacing: '2px',
                fontWeight: 'bold'
              }}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}