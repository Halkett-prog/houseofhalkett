'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function HalkettNavbar() {
  const pathname = usePathname();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === 'halkett2025') {
      window.location.href = '/admin/orders';
    } else {
      alert('Invalid password');
    }
    setAdminPassword('');
    setShowAdminLogin(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <header style={{
        background: '#232320',
        color: '#EFEEE1',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(35,35,32,0.2)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isScrolled ? '10px 20px' : '30px 20px',
          transition: 'all 0.3s ease'
        }}>
          {/* Compact header when scrolled */}
          {isScrolled ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {/* Logo and title inline */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <Image 
                  src="/images/halkett-logo.png" 
                  alt="HALKETT Logo" 
                  width={40} 
                  height={40}
                  style={{
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1) sepia(1) saturate(0.5) hue-rotate(30deg) brightness(0.95)',
                    width: '40px',
                    height: 'auto'
                  }}
                />
                <h1 style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '18px',
                  letterSpacing: '4px',
                  margin: 0,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#EFEEE1'
                }}>
                  HOUSE OF HALKETT
                </h1>
              </div>

              {/* Navigation inline */}
              <nav style={{
                display: 'flex',
                gap: '30px'
              }}>
                <Link 
                  href="/"
                  style={{
                    color: isActive('/') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/') && (e.target.style.color = '#EFEEE1')}
                >
                  HOME
                </Link>

                <Link 
                  href="/calculator"
                  style={{
                    color: isActive('/calculator') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/calculator') && (e.target.style.color = '#EFEEE1')}
                >
                  CALCULATOR
                </Link>

                <Link 
                  href="/materials"
                  style={{
                    color: isActive('/materials') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/materials') && (e.target.style.color = '#EFEEE1')}
                >
                  MATERIALS
                </Link>

                <Link 
                  href="/cart"
                  style={{
                    color: isActive('/cart') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/cart') && (e.target.style.color = '#EFEEE1')}
                >
                  CART
                </Link>
              </nav>
            </div>
          ) : (
            // Full header when not scrolled
            <>
              <div style={{
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  marginBottom: '15px'
                }}>
                  <Image 
                    src="/images/halkett-logo.png" 
                    alt="HALKETT Logo" 
                    width={120} 
                    height={100}
                    style={{
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1) sepia(1) saturate(0.5) hue-rotate(30deg) brightness(0.95)',
                      width: 'clamp(50px, 8vw, 120px)',
                      height: 'auto',
                      maxWidth: '100%'
                    }}
                  />
                  <h1 style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: 'clamp(28px, 5vw, 36px)',
                    letterSpacing: '15px',
                    margin: 0,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#EFEEE1'
                  }}>
                    HOUSE OF HALKETT
                  </h1>
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 2.5vw, 13px)',
                  color: '#A1A2A0',
                  letterSpacing: '3px',
                  fontWeight: 400,
                  textTransform: 'uppercase'
                }}>
                  THE ART OF WALLS
                </div>
              </div>

              <div style={{
                height: '1px',
                background: '#444',
                margin: '20px auto',
                maxWidth: '600px'
              }} />

              <nav style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                flexWrap: 'wrap'
              }}>
                <Link 
                  href="/"
                  style={{
                    color: isActive('/') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2.2px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    padding: '5px 0'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/') && (e.target.style.color = '#EFEEE1')}
                >
                  HOME
                  {isActive('/') && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#B19359'
                    }} />
                  )}
                </Link>

                <Link 
                  href="/calculator"
                  style={{
                    color: isActive('/calculator') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2.2px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    padding: '5px 0'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/calculator') && (e.target.style.color = '#EFEEE1')}
                >
                  CALCULATOR
                  {isActive('/calculator') && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#B19359'
                    }} />
                  )}
                </Link>

                <Link 
                  href="/materials"
                  style={{
                    color: isActive('/materials') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2.2px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    padding: '5px 0'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/materials') && (e.target.style.color = '#EFEEE1')}
                >
                  MATERIALS
                  {isActive('/materials') && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#B19359'
                    }} />
                  )}
                </Link>

                <Link 
                  href="/cart"
                  style={{
                    color: isActive('/cart') ? '#B19359' : '#EFEEE1',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2.2px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    padding: '5px 0'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#B19359'}
                  onMouseLeave={(e) => !isActive('/cart') && (e.target.style.color = '#EFEEE1')}
                >
                  CART
                  {isActive('/cart') && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#B19359'
                    }} />
                  )}
                </Link>
              </nav>
            </>
          )}
        </div>

        {/* Hidden Admin Access */}
        <div 
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100px',
            height: '100px',
            cursor: 'pointer',
            opacity: 0
          }}
          onDoubleClick={() => setShowAdminLogin(true)}
          title="Admin Access"
        />
      </header>

      {/* Add padding to body to account for fixed header */}
      <div style={{ paddingTop: isScrolled ? '60px' : '180px', transition: 'padding 0.3s ease' }} />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(35,35,32,0.95)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            padding: '40px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{
              fontSize: '20px',
              marginBottom: '30px',
              textTransform: 'uppercase',
              letterSpacing: '2.2px',
              color: '#232320',
              fontFamily: "'Roboto Mono', monospace"
            }}>
              ADMIN ACCESS
            </h3>
            
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  color: '#232320',
                  marginBottom: '8px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2.2px',
                  fontFamily: "'Roboto Mono', monospace"
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #D1C6B4',
                    background: '#fff',
                    fontSize: '16px',
                    fontFamily: "'Roboto Mono', monospace",
                    borderRadius: 0
                  }}
                  autoFocus
                />
              </div>
              
              <div style={{
                display: 'flex',
                gap: '15px',
                marginTop: '30px'
              }}>
                <button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  style={{
                    flex: 1,
                    background: '#fff',
                    color: '#34499E',
                    border: '2px solid #34499E',
                    padding: '16px 32px',
                    fontSize: '12px',
                    fontFamily: "'Roboto Mono', monospace",
                    letterSpacing: '2.2px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    borderRadius: 0
                  }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAdminLogin}
                  style={{
                    flex: 1,
                    background: '#34499E',
                    color: '#fff',
                    border: 'none',
                    padding: '16px 32px',
                    fontSize: '12px',
                    fontFamily: "'Roboto Mono', monospace",
                    letterSpacing: '2.2px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    borderRadius: 0
                  }}
                >
                  LOGIN
                </button>
              </div>
            </div>
            
            <p style={{
              marginTop: '20px',
              fontSize: '11px',
              color: '#A1A2A0',
              textAlign: 'center',
              fontFamily: "'Roboto Mono', monospace"
            }}>
              For HALKETT staff only
            </p>
          </div>
        </div>
      )}
    </>
  );
}