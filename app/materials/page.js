'use client';

import React, { useState, useEffect } from 'react';

export default function MaterialsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Material catalog - organized by category
  const materials = {
    rehau: {
      name: 'REHAU Surfaces',
      description: 'Premium engineered surfaces',
      items: [
        {
          id: 'rehau-001',
          name: 'REHAU RAUVISIO Crystal',
          category: 'Glass Laminate',
          description: 'High-gloss acrylic glass laminate with exceptional depth and brilliance',
          price: 285,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '18mm',
          finish: 'High Gloss',
          colors: ['Deep Black', 'Alpine White', 'Graphite Grey'],
          image: 'crystal-black'
        },
        {
          id: 'rehau-002',
          name: 'REHAU RAUVISIO Noir',
          category: 'Super Matte',
          description: 'Ultra-matte surface with anti-fingerprint technology',
          price: 310,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '18mm',
          finish: 'Super Matte',
          colors: ['Charcoal', 'Midnight', 'Stone Grey'],
          image: 'noir-charcoal'
        },
        {
          id: 'rehau-003',
          name: 'REHAU RAUVISIO Terra',
          category: 'Textured',
          description: 'Authentic wood grain texture with synchronized embossing',
          price: 265,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '18mm',
          finish: 'Textured Matte',
          colors: ['Oak Natural', 'Walnut Dark', 'Ash Grey'],
          image: 'terra-oak'
        }
      ]
    },
    egger: {
      name: 'EGGER Panels',
      description: 'European engineered wood products',
      items: [
        {
          id: 'egger-001',
          name: 'EGGER PerfectSense',
          category: 'Lacquered Board',
          description: 'Premium lacquered MDF with superior surface quality',
          price: 225,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '19mm',
          finish: 'High Gloss / Matte',
          colors: ['Pure White', 'Cashmere', 'Graphite'],
          image: 'perfectsense-white'
        },
        {
          id: 'egger-002',
          name: 'EGGER Feelwood',
          category: 'Synchronized Texture',
          description: 'Perfectly synchronized wood texture and grain pattern',
          price: 195,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '18mm',
          finish: 'Natural Texture',
          colors: ['Oak Halifax', 'Walnut Charlotte', 'Pine Nordic'],
          image: 'feelwood-oak'
        }
      ]
    },
    sicis: {
      name: 'SICIS Glass',
      description: 'Italian luxury glass surfaces',
      items: [
        {
          id: 'sicis-001',
          name: 'SICIS Vetrite',
          category: 'Back-Painted Glass',
          description: 'Premium Italian back-painted glass with perfect color consistency',
          price: 425,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '6mm',
          finish: 'High Gloss',
          colors: ['Bianco Puro', 'Nero Assoluto', 'Grigio Londra'],
          image: 'vetrite-bianco'
        },
        {
          id: 'sicis-002',
          name: 'SICIS Diamond',
          category: 'Textured Glass',
          description: 'Diamond pattern textured glass for dramatic light play',
          price: 485,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '8mm',
          finish: 'Textured',
          colors: ['Crystal Clear', 'Bronze Tint', 'Grey Smoke'],
          image: 'diamond-crystal'
        }
      ]
    },
    halkett: {
      name: 'HALKETT Flow System',
      description: 'Metal-covered MDF panels',
      items: [
        {
          id: 'flow-001',
          name: 'Flow System - Brass',
          category: 'Metal Covered MDF',
          description: 'Solid brass sheet over premium MDF core, perfect for cabinetry and wall panels',
          price: 385,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '19mm',
          finish: 'Brushed / Patina',
          colors: ['Natural Brass', 'Antique Brass', 'Brushed Brass'],
          image: 'flow-brass'
        },
        {
          id: 'flow-002',
          name: 'Flow System - Copper',
          category: 'Metal Covered MDF',
          description: 'Pure copper veneer over MDF, develops natural patina over time',
          price: 365,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '19mm',
          finish: 'Natural / Patina',
          colors: ['Raw Copper', 'Aged Copper', 'Burnished Copper'],
          image: 'flow-copper'
        },
        {
          id: 'flow-003',
          name: 'Flow System - Stainless',
          category: 'Metal Covered MDF',
          description: 'Stainless steel surface for modern, hygienic applications',
          price: 345,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '19mm',
          finish: 'Brushed / Mirror',
          colors: ['Brushed Steel', 'Mirror Polish', 'Satin Steel'],
          image: 'flow-stainless'
        },
        {
          id: 'flow-004',
          name: 'Flow System - Blackened Steel',
          category: 'Metal Covered MDF',
          description: 'Blackened steel finish for dramatic contemporary interiors',
          price: 395,
          unit: 'per sheet',
          size: "4' x 8'",
          thickness: '19mm',
          finish: 'Blackened',
          colors: ['Midnight Black', 'Charcoal', 'Gun Metal'],
          image: 'flow-blackened'
        }
      ]
    }
  };

  useEffect(() => {
    updateCartCount();
    // Add Roboto Mono font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const updateCartCount = () => {
    const calculator = localStorage.getItem('pendingCalculatorOrder');
    const materials = JSON.parse(localStorage.getItem('materialOrders') || '[]');
    let count = materials.length;
    if (calculator) count++;
    setCartCount(count);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
    updateCartCount();
  };

  const addToCart = (material, qty = 1) => {
    const existingMaterials = JSON.parse(localStorage.getItem('materialOrders') || '[]');
    
    // Check if item already exists
    const existingIndex = existingMaterials.findIndex(item => item.id === material.id);
    
    if (existingIndex >= 0) {
      // Update quantity if exists
      existingMaterials[existingIndex].quantity += qty;
    } else {
      // Add new item
      existingMaterials.push({
        id: material.id,
        name: material.name,
        description: `${material.category} - ${material.size} - ${material.finish}`,
        price: material.price,
        quantity: qty,
        type: 'material',
        details: material
      });
    }
    
    localStorage.setItem('materialOrders', JSON.stringify(existingMaterials));
    showNotification(`Added ${material.name} to cart`);
    setSelectedMaterial(null);
    setQuantity(1);
  };

  const getAllMaterials = () => {
    let allItems = [];
    Object.values(materials).forEach(category => {
      allItems = [...allItems, ...category.items];
    });
    return allItems;
  };

  const getFilteredMaterials = () => {
    if (selectedCategory === 'all') {
      return getAllMaterials();
    }
    return materials[selectedCategory]?.items || [];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EFEEE1',
      fontFamily: "'Roboto Mono', monospace"
    }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.type === 'error' ? '#F44336' : '#4CAF50',
          color: '#fff',
          padding: '16px 24px',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          boxShadow: '0 4px 12px rgba(35,35,32,0.2)',
          zIndex: 2000,
          animation: 'slideIn 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
          {notification.message}
        </div>
      )}

      {/* Cart Float Button */}
      <button
        onClick={() => window.location.href = '/cart'}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: '#34499E',
          color: '#fff',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(52, 73, 158, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
        </svg>
        {cartCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#B19359',
            color: '#fff',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {cartCount}
          </span>
        )}
      </button>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Page Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          borderBottom: '2px solid #D1C6B4',
          paddingBottom: '20px'
        }}>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 28px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2.2px',
            color: '#232320',
            margin: '0 0 10px 0'
          }}>
            MATERIALS CATALOG
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#A1A2A0',
            letterSpacing: '0.5px'
          }}>
            Premium sheet goods and engineered panels for cabinetry and walls
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              background: selectedCategory === 'all' ? '#34499E' : '#fff',
              color: selectedCategory === 'all' ? '#fff' : '#232320',
              border: '2px solid #34499E',
              padding: '12px 24px',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: 0,
              transition: 'all 0.2s ease'
            }}
          >
            ALL MATERIALS
          </button>
          <button
            onClick={() => setSelectedCategory('rehau')}
            style={{
              background: selectedCategory === 'rehau' ? '#34499E' : '#fff',
              color: selectedCategory === 'rehau' ? '#fff' : '#232320',
              border: '2px solid #34499E',
              padding: '12px 24px',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: 0,
              transition: 'all 0.2s ease'
            }}
          >
            REHAU
          </button>
          <button
            onClick={() => setSelectedCategory('egger')}
            style={{
              background: selectedCategory === 'egger' ? '#34499E' : '#fff',
              color: selectedCategory === 'egger' ? '#fff' : '#232320',
              border: '2px solid #34499E',
              padding: '12px 24px',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: 0,
              transition: 'all 0.2s ease'
            }}
          >
            EGGER
          </button>
          <button
            onClick={() => setSelectedCategory('sicis')}
            style={{
              background: selectedCategory === 'sicis' ? '#34499E' : '#fff',
              color: selectedCategory === 'sicis' ? '#fff' : '#232320',
              border: '2px solid #34499E',
              padding: '12px 24px',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: 0,
              transition: 'all 0.2s ease'
            }}
          >
            SICIS GLASS
          </button>
          <button
            onClick={() => setSelectedCategory('halkett')}
            style={{
              background: selectedCategory === 'halkett' ? '#B19359' : '#fff',
              color: selectedCategory === 'halkett' ? '#fff' : '#B19359',
              border: '2px solid #B19359',
              padding: '12px 24px',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: 0,
              transition: 'all 0.2s ease'
            }}
          >
            HALKETT FLOW
          </button>
        </div>

        {/* Materials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {getFilteredMaterials().map(material => (
            <div key={material.id} style={{
              background: '#fff',
              boxShadow: '0 2px 10px rgba(35,35,32,0.08)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(35,35,32,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(35,35,32,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => setSelectedMaterial(material)}
            >
              {/* Material Image Placeholder */}
              <div style={{
                height: '200px',
                background: `linear-gradient(135deg, #${material.id.includes('rehau') ? '34499E' : material.id.includes('egger') ? 'A1A2A0' : material.id.includes('sicis') ? '232320' : 'B19359'} 0%, #232320 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{
                  color: '#fff',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '10px',
                    opacity: 0.3
                  }}>
                    ◼
                  </div>
                  <div style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    opacity: 0.8
                  }}>
                    {material.category}
                  </div>
                </div>
                {/* Price Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#B19359',
                  color: '#fff',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 700
                }}>
                  ${material.price}
                </div>
              </div>

              {/* Material Info */}
              <div style={{ padding: '25px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#232320'
                }}>
                  {material.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '15px',
                  lineHeight: 1.5
                }}>
                  {material.description}
                </p>
                
                {/* Specifications */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '20px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: '#A1A2A0', textTransform: 'uppercase', fontSize: '10px' }}>SIZE</span>
                    <div style={{ fontWeight: 600 }}>{material.size}</div>
                  </div>
                  <div>
                    <span style={{ color: '#A1A2A0', textTransform: 'uppercase', fontSize: '10px' }}>THICKNESS</span>
                    <div style={{ fontWeight: 600 }}>{material.thickness}</div>
                  </div>
                  <div>
                    <span style={{ color: '#A1A2A0', textTransform: 'uppercase', fontSize: '10px' }}>FINISH</span>
                    <div style={{ fontWeight: 600 }}>{material.finish}</div>
                  </div>
                  <div>
                    <span style={{ color: '#A1A2A0', textTransform: 'uppercase', fontSize: '10px' }}>UNIT</span>
                    <div style={{ fontWeight: 600 }}>{material.unit}</div>
                  </div>
                </div>

                {/* Color Options */}
                {material.colors && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ 
                      fontSize: '10px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '1px',
                      color: '#A1A2A0',
                      marginBottom: '8px'
                    }}>
                      Available Colors
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {material.colors.map(color => (
                        <span key={color} style={{
                          padding: '4px 10px',
                          background: '#F8F7F5',
                          fontSize: '11px',
                          color: '#232320'
                        }}>
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(material);
                  }}
                  style={{
                    width: '100%',
                    background: '#34499E',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    fontSize: '12px',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#232320'}
                  onMouseLeave={(e) => e.target.style.background = '#34499E'}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredMaterials().length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: '#fff',
            boxShadow: '0 2px 10px rgba(35,35,32,0.08)'
          }}>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '10px',
              color: '#232320',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              No materials found
            </h3>
            <p style={{ color: '#A1A2A0', fontSize: '14px' }}>
              Try selecting a different category
            </p>
          </div>
        )}
      </div>

      {/* Material Detail Modal */}
      {selectedMaterial && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(35,35,32,0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setSelectedMaterial(null)}
        >
          <div style={{
            background: '#fff',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '40px'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '30px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  marginBottom: '5px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#232320'
                }}>
                  {selectedMaterial.name}
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#A1A2A0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {selectedMaterial.category}
                </p>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none" stroke="#232320" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Material Image */}
            <div style={{
              height: '250px',
              background: `linear-gradient(135deg, #${selectedMaterial.id.includes('flow') ? 'B19359' : '34499E'} 0%, #232320 100%)`,
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ color: '#fff', fontSize: '72px', opacity: 0.3 }}>◼</div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: 1.6,
              marginBottom: '30px'
            }}>
              {selectedMaterial.description}
            </p>

            {/* Full Specifications */}
            <div style={{
              background: '#F8F7F5',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h4 style={{
                fontSize: '12px',
                marginBottom: '15px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: '#232320'
              }}>
                SPECIFICATIONS
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                fontSize: '13px'
              }}>
                <div>
                  <span style={{ color: '#A1A2A0', display: 'block', marginBottom: '2px', fontSize: '11px' }}>SIZE</span>
                  <strong>{selectedMaterial.size}</strong>
                </div>
                <div>
                  <span style={{ color: '#A1A2A0', display: 'block', marginBottom: '2px', fontSize: '11px' }}>THICKNESS</span>
                  <strong>{selectedMaterial.thickness}</strong>
                </div>
                <div>
                  <span style={{ color: '#A1A2A0', display: 'block', marginBottom: '2px', fontSize: '11px' }}>FINISH</span>
                  <strong>{selectedMaterial.finish}</strong>
                </div>
                <div>
                  <span style={{ color: '#A1A2A0', display: 'block', marginBottom: '2px', fontSize: '11px' }}>PRICE</span>
                  <strong>${selectedMaterial.price} {selectedMaterial.unit}</strong>
                </div>
              </div>
            </div>

            {/* Colors */}
            {selectedMaterial.colors && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{
                  fontSize: '12px',
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#232320'
                }}>
                  AVAILABLE COLORS
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {selectedMaterial.colors.map(color => (
                    <div key={color} style={{
                      padding: '10px 20px',
                      border: '2px solid #D1C6B4',
                      fontSize: '12px',
                      color: '#232320',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#34499E';
                      e.currentTarget.style.background = '#34499E';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#D1C6B4';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#232320';
                    }}
                    >
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: '#232320'
                }}>
                  QUANTITY
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  style={{
                    width: '80px',
                    padding: '12px',
                    border: '2px solid #D1C6B4',
                    fontSize: '14px',
                    fontFamily: "'Roboto Mono', monospace",
                    borderRadius: 0
                  }}
                />
              </div>
              <button
                onClick={() => addToCart(selectedMaterial, quantity)}
                style={{
                  flex: 1,
                  background: '#34499E',
                  color: '#fff',
                  border: 'none',
                  padding: '16px 32px',
                  fontSize: '12px',
                  letterSpacing: '2.2px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  borderRadius: 0,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#232320'}
                onMouseLeave={(e) => e.target.style.background = '#34499E'}
              >
                ADD TO CART
              </button>
            </div>

            {/* Contact for Custom */}
            <div style={{
              marginTop: '30px',
              paddingTop: '30px',
              borderTop: '1px solid #D1C6B4',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#A1A2A0',
                marginBottom: '10px'
              }}>
                Need custom sizes or specifications?
              </p>
              <p style={{
                fontSize: '14px',
                color: '#232320',
                fontWeight: 600,
                letterSpacing: '1px'
              }}>
                CALL 215.721.9331
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}