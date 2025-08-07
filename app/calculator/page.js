'use client';
import CalculatorComponent from './CalculatorComponent';

export default function CalculatorPage() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#EFEEE1',
      fontFamily: "'Roboto Mono', monospace"
    }}>
      {/* Use the React Component instead of iframe */}
      <CalculatorComponent />
      
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
    </main>
  );
}