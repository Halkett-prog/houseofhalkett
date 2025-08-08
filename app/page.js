export default function Home() {
  return (
    <main style={{ 
      marginTop: '180px',  // Fixes header overlap
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
          <a href="/materials" className="btn">
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

          {/* Materials Card */}
          <div className="stat-card">
            <div className="stat-number">🎨</div>
            <h3 className="stat-label">MATERIALS</h3>
            <p style={{ 
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6',
              letterSpacing: '0.15px',
              marginTop: '10px'
            }}>
              Premium wood, leather, glass and metal finishes
            </p>
          </div>

          {/* Custom Card */}
          <div className="stat-card">
            <div className="stat-number">✨</div>
            <h3 className="stat-label">CUSTOM</h3>
            <p style={{ 
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.6',
              letterSpacing: '0.15px',
              marginTop: '10px'
            }}>
              Tailored solutions for unique spaces
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{
        maxWidth: '800px',
        margin: '80px auto',
        padding: '0 20px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 32px)',
          marginBottom: '20px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#232320'
        }}>
          The Art of Walls
        </h2>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#666',
          letterSpacing: '0.3px'
        }}>
          HALKETT creates architectural wall systems that redefine modern spaces. 
          Our modular approach combines precision engineering with luxury materials, 
          delivering seamless installations that transform any environment.
        </p>
      </div>

      {/* Contact Section */}
      <div style={{
        background: '#232320',
        color: '#EFEEE1',
        padding: '60px 20px',
        textAlign: 'center',
        marginTop: '80px'
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 32px)',
          marginBottom: '20px',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Start Your Project
        </h2>
        <p style={{
          fontSize: '16px',
          opacity: 0.9,
          marginBottom: '30px',
          maxWidth: '600px',
          margin: '0 auto 30px'
        }}>
          Ready to transform your space? Calculate your custom wall system or browse our premium materials.
        </p>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a href="/calculator" className="btn" style={{ background: '#B19359', border: 'none' }}>
            Start Calculator
          </a>
          <a href="tel:2157219331" className="btn" style={{ background: 'transparent', border: '2px solid #B19359' }}>
            Call 215.721.9331
          </a>
        </div>
      </div>
    </main>
  );
}