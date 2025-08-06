// app/cart/page.js
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CartPage() {
  const [calculatorItems, setCalculatorItems] = useState([]);
  const [materialItems, setMaterialItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    console.log('Loading cart items...');
    try {
      // Load calculator configuration
      const calcConfig = localStorage.getItem('pendingCalculatorOrder');
      console.log('Calculator config:', calcConfig);
      if (calcConfig) {
        const parsed = JSON.parse(calcConfig);
        setCalculatorItems([parsed]);
      }

      // Load material selections
      const materials = localStorage.getItem('materialOrders');
      console.log('Materials:', materials);
      if (materials) {
        const parsed = JSON.parse(materials);
        setMaterialItems(Array.isArray(parsed) ? parsed : [parsed]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeCalculatorItem = (index) => {
    const newItems = calculatorItems.filter((_, i) => i !== index);
    setCalculatorItems(newItems);
    if (newItems.length === 0) {
      localStorage.removeItem('pendingCalculatorOrder');
    }
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
    
    // Add calculator items (assuming each config has a total)
    calculatorItems.forEach(item => {
      total += item.estimatedCost || 0;
    });
    
    // Add material items
    materialItems.forEach(item => {
      total += (item.price || 0) * (item.quantity || 1);
    });
    
    return total;
  };

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `HLK-${year}${month}${day}-${random}`;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderNum = generateOrderNumber();
      const orderData = {
        order_number: orderNum,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_company: customerInfo.company,
        notes: customerInfo.notes,
        calculator_configs: calculatorItems,
        material_items: materialItems,
        total_amount: calculateTotal(),
        status: 'new',
        source: calculatorItems.length > 0 && materialItems.length > 0 ? 'mixed' : 
                calculatorItems.length > 0 ? 'calculator' : 'materials',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) throw error;

      // Clear cart after successful order
      localStorage.removeItem('pendingCalculatorOrder');
      localStorage.removeItem('materialOrders');
      
      setOrderNumber(orderNum);
      setOrderSuccess(true);
      setCalculatorItems([]);
      setMaterialItems([]);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEmpty = calculatorItems.length === 0 && materialItems.length === 0;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#EFEEE1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginTop: '20px', color: '#A1A2A0' }}>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#EFEEE1',
        padding: '60px 20px',
        fontFamily: "'Roboto Mono', monospace"
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(35,35,32,0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#34499E',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg style={{ width: '30px', height: '30px', color: 'white' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h2 style={{
              fontSize: '24px',
              letterSpacing: '2px',
              marginBottom: '10px',
              color: '#232320'
            }}>
              ORDER SUBMITTED
            </h2>
            
            <p style={{
              fontSize: '18px',
              color: '#34499E',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Order #{orderNumber}
            </p>
            
            <p style={{
              color: '#A1A2A0',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Thank you for your order. We'll review your specifications and contact you within 24 hours with a detailed quote and timeline.
            </p>
            
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: '#232320',
                color: '#EFEEE1',
                border: 'none',
                padding: '16px 32px',
                fontSize: '12px',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}
            >
              RETURN HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#EFEEE1',
        padding: '60px 20px',
        fontFamily: "'Roboto Mono', monospace"
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            letterSpacing: '2px',
            marginBottom: '20px',
            color: '#232320'
          }}>
            YOUR CART IS EMPTY
          </h1>
          
          <p style={{
            color: '#A1A2A0',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Configure a wall system or browse our materials to get started.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => window.location.href = '/calculator'}
              style={{
                background: '#34499E',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                fontSize: '12px',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontWeight: '700',
                textTransform: 'uppercase'
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
                padding: '16px 32px',
                fontSize: '12px',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}
            >
              BROWSE MATERIALS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EFEEE1',
      padding: '40px 20px',
      fontFamily: "'Roboto Mono', monospace"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '28px',
          letterSpacing: '4px',
          marginBottom: '40px',
          color: '#232320',
          textAlign: 'center'
        }}>
          SHOPPING CART
        </h1>

        {/* Cart Items Section */}
        <div style={{
          display: 'grid',
          gap: '30px',
          gridTemplateColumns: showCheckout ? '1fr 400px' : '1fr',
        }}>
          <div>
            {/* Calculator Configurations */}
            {calculatorItems.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  fontSize: '14px',
                  letterSpacing: '2px',
                  marginBottom: '20px',
                  color: '#232320',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #232320',
                  paddingBottom: '10px'
                }}>
                  Wall Configurations
                </h2>
                
                {calculatorItems.map((item, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '20px',
                    marginBottom: '15px',
                    boxShadow: '0 2px 10px rgba(35,35,32,0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '16px',
                          marginBottom: '10px',
                          color: '#232320'
                        }}>
                          {item.projectName || 'Wall Configuration'}
                        </h3>
                        
                        <div style={{
                          fontSize: '13px',
                          color: '#A1A2A0',
                          lineHeight: '1.8'
                        }}>
                          <p>Height: {item.wallHeight}"</p>
                          <p>Coverage: {item.coverageType}</p>
                          <p>Profile: {item.profile}</p>
                          <p>Material: {item.boardMaterial}</p>
                          <p>Walls: {item.wallCount}</p>
                        </div>
                        
                        {item.estimatedCost && (
                          <p style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginTop: '10px',
                            color: '#34499E'
                          }}>
                            Estimated: ${item.estimatedCost.toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeCalculatorItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#A1A2A0',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                        aria-label="Remove item"
                      >
                        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Material Items */}
            {materialItems.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                  fontSize: '14px',
                  letterSpacing: '2px',
                  marginBottom: '20px',
                  color: '#232320',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #232320',
                  paddingBottom: '10px'
                }}>
                  Materials
                </h2>
                
                {materialItems.map((item, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '20px',
                    marginBottom: '15px',
                    boxShadow: '0 2px 10px rgba(35,35,32,0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '16px',
                          marginBottom: '10px',
                          color: '#232320'
                        }}>
                          {item.name}
                        </h3>
                        
                        <div style={{
                          fontSize: '13px',
                          color: '#A1A2A0',
                          lineHeight: '1.8'
                        }}>
                          {item.description && <p>{item.description}</p>}
                          <p>Quantity: {item.quantity || 1}</p>
                        </div>
                        
                        {item.price && (
                          <p style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginTop: '10px',
                            color: '#34499E'
                          }}>
                            ${(item.price * (item.quantity || 1)).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeMaterialItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#A1A2A0',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                        aria-label="Remove item"
                      >
                        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Summary */}
            <div style={{
              background: '#232320',
              color: '#EFEEE1',
              padding: '30px',
              marginTop: '30px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  letterSpacing: '2px'
                }}>
                  ESTIMATED TOTAL
                </h3>
                <p style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#B19359'
                }}>
                  ${calculateTotal().toLocaleString()}
                </p>
              </div>
              
              <p style={{
                fontSize: '12px',
                opacity: 0.8,
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                * Final pricing will be confirmed after design review. This estimate does not include shipping or installation.
              </p>
              
              {!showCheckout && (
                <button
                  onClick={() => setShowCheckout(true)}
                  style={{
                    width: '100%',
                    background: '#B19359',
                    color: '#232320',
                    border: 'none',
                    padding: '16px',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                >
                  PROCEED TO CHECKOUT
                </button>
              )}
            </div>
          </div>

          {/* Checkout Form */}
          {showCheckout && (
            <div style={{
              background: 'white',
              padding: '30px',
              height: 'fit-content',
              boxShadow: '0 4px 20px rgba(35,35,32,0.1)'
            }}>
              <h3 style={{
                fontSize: '16px',
                letterSpacing: '2px',
                marginBottom: '20px',
                color: '#232320',
                textTransform: 'uppercase'
              }}>
                Contact Information
              </h3>
              
              <form onSubmit={handleSubmitOrder}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#232320',
                    marginBottom: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #D1C6B4',
                      background: '#FAFAFA',
                      fontSize: '14px',
                      fontFamily: "'Roboto Mono', monospace"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#232320',
                    marginBottom: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #D1C6B4',
                      background: '#FAFAFA',
                      fontSize: '14px',
                      fontFamily: "'Roboto Mono', monospace"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#232320',
                    marginBottom: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #D1C6B4',
                      background: '#FAFAFA',
                      fontSize: '14px',
                      fontFamily: "'Roboto Mono', monospace"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#232320',
                    marginBottom: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={customerInfo.company}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #D1C6B4',
                      background: '#FAFAFA',
                      fontSize: '14px',
                      fontFamily: "'Roboto Mono', monospace"
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#232320',
                    marginBottom: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Project Notes
                  </label>
                  <textarea
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #D1C6B4',
                      background: '#FAFAFA',
                      fontSize: '14px',
                      fontFamily: "'Roboto Mono', monospace",
                      resize: 'vertical'
                    }}
                    placeholder="Timeline, special requirements, etc."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    background: submitting ? '#A1A2A0' : '#34499E',
                    color: 'white',
                    border: 'none',
                    padding: '16px',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                >
                  {submitting ? 'SUBMITTING...' : 'SUBMIT ORDER'}
                </button>
                
                <p style={{
                  fontSize: '11px',
                  color: '#A1A2A0',
                  marginTop: '15px',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}>
                  By submitting, you'll receive a detailed quote within 24 hours. No payment required now.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
