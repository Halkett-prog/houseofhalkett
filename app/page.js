export default function Home() {
  return (
    <main style={{ 
      paddingBottom: '100px',
      fontFamily: "'Roboto Mono', monospace",
      background: '#EFEEE1'
    }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #232320 0%, #3a3a37 100%)',
        color: '#EFEEE1',
        textAlign: 'center',
        padding: '60px 20px',
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(32px, 5vw, 48px)',
          marginBottom: '20px',
          letterSpacing: '2.2px',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#EFEEE1'
        }}>
          Architectural Wall Systems
        </h1>
        <p style={{ 
          fontSize: '16px',
          opacity: 0.9,
          marginBottom: '40px',
          letterSpacing: '0.5px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Transform your space with HALKETT's modular luxury wall systems.
          Custom-crafted to perfection.
        </p>
        
        {/* CTA Buttons */}
        <div style={{ 
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a href="/calculator" className="btn">
            📐 START WALL CALCULATOR
          </a>
          <a href="/materials" className="btn-secondary">
            🎨 BROWSE MATERIALS
          </a>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div className="mobile-grid">
          {/* Calculate Card */}
          <div className="stat-card">
            <div className="stat-number">📐</div>
            <h3 className="stat-label">CALCULATE</h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6',
              letterSpacing: '0.15px',
              marginTop: '10px'
            }}>
              Instant pricing for your custom wall system
            </p>
          </div>
          
          {/* Customize Card */}
          <div className="stat-card">
            <div className="stat-number">🎨</div>
            <h3 className="stat-label">CUSTOMIZE</h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6',
              letterSpacing: '0.15px',
              marginTop: '10px'
            }}>
              Choose from premium materials and finishes
            </p>
          </div>
          
          {/* Deliver Card */}
          <div className="stat-card">
            <div className="stat-number">📦</div>
            <h3 className="stat-label">DELIVER</h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6',
              letterSpacing: '0.15px',
              marginTop: '10px'
            }}>
              Complete system ready for installation
            </p>
          </div>
        </div>

        {/* About Section */}
        <div style={{
          background: '#232320',
          color: '#EFEEE1',
          padding: '60px 40px',
          marginTop: '60px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            marginBottom: '20px',
            letterSpacing: '2.2px',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: '#B19359'
          }}>
            THE ART OF WALLS
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto 30px',
            letterSpacing: '0.15px'
          }}>
            HALKETT specializes in creating architectural wall systems that transform spaces. 
            Our modular board system combines traditional craftsmanship with modern precision, 
            delivering luxury finishes that define contemporary interiors.
          </p>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#B19359',
            letterSpacing: '1px'
          }}>
            215.721.9331
          </div>
        </div>
      </div>

      {/* Sticky Bottom Nav for Mobile */}
      <div className="bottom-nav">
        <a href="/calculator" className="btn" style={{ flex: 1 }}>
          CALCULATOR
        </a>
        <a href="/cart" className="btn-secondary" style={{ flex: 1 }}>
          CART
        </a>
      </div>
    </main>
  );
}