'use client'
export default function HalkettNavbar() {
  return (
    <div style={{ 
      width: '100%', 
      height: '64px', 
      backgroundColor: '#232320', 
      color: '#EFEEE1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>HALKETT</div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <a href="/" style={{ color: '#EFEEE1' }}>HOME</a>
        <a href="/calculator" style={{ color: '#EFEEE1' }}>CALCULATOR</a>
        <a href="/materials" style={{ color: '#EFEEE1' }}>MATERIALS</a>
        <a href="/cart" style={{ color: '#EFEEE1' }}>CART</a>
        <a href="/admin/orders" style={{ color: '#EFEEE1' }}>ORDERS</a>
      </div>
    </div>
  )
}