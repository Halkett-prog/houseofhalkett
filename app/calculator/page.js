'use client';
export default function CalculatorPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#EFEEE1',
      fontFamily: "'Roboto Mono', monospace"
    }}>
      {/* Calculator Section - NO DUPLICATE HEADER */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 700,
              marginBottom: '15px',
              color: '#232320',
              textTransform: 'uppercase',
              letterSpacing: '2.2px'
            }}>
              Wall System Calculator
            </h2>
            <p style={{ 
              fontSize: '14px',
              color: '#A1A2A0',
              letterSpacing: '0.5px'
            }}>
              Configure your modular wall system and get instant pricing
            </p>
          </div>
          
          {/* Calculator iframe */}
          <div style={{ 
            background: 'white',
            boxShadow: '0 2px 10px rgba(35,35,32,0.08)',
            overflow: 'hidden'
          }}>
            <iframe 
              src="https://halkett-calculator.vercel.app"
              style={{ 
                width: '100%',
                height: '800px',
                minHeight: '600px',
                border: 'none'
              }}
              title="HALKETT Wall System Calculator"
            />
          </div>

          {/* Info section */}
          <div style={{ 
            marginTop: '40px',
            textAlign: 'center',
            padding: '30px',
            background: 'white',
            boxShadow: '0 2px 10px rgba(35,35,32,0.08)'
          }}>
            <p style={{ 
              fontSize: '14px',
              color: '#666',
              marginBottom: '20px',
              letterSpacing: '0.15px'
            }}>
              Need help? Call us at <strong>215.721.9331</strong> or email <strong>info@halkett.com</strong>
            </p>
            <a 
              href="/materials"
              style={{
                color: '#B19359',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.5px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#232320'}
              onMouseLeave={(e) => e.target.style.color = '#B19359'}
            >
              Looking for other custom woodworking? Browse our materials →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}