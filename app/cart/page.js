'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const items = [];
    
    // Load calculator order
    const calculatorOrder = localStorage.getItem('pendingCalculatorOrder');
    if (calculatorOrder) {
      try {
        const order = JSON.parse(calculatorOrder);
        items.push({
          id: 'calc-1',
          type: 'calculator',
          name: order.projectName || 'Custom Wall Configuration',
          description: `Material: ${order.material || 'Wood'} | Profile: ${order.profile || 'Classic'} | Coverage: ${order.coverage || 'Full Height'}`,
          details: order.results || 'Complete wall system configuration',
          price: order.totalCost || 5000,
          quantity: 1,
          canEditQuantity: false, // Calculator configs can't change quantity
          icon: '📐'
        });
      } catch (e) {
        console.error('Error parsing calculator order:', e);
      }
    }
    
    // Load material orders
    const materialOrders = localStorage.getItem('materialOrders');
    if (materialOrders) {
      try {
        const materials = JSON.parse(materialOrders);
        materials.forEach((material, index) => {
          items.push({
            id: `mat-${index}`,
            type: 'material',
            name: material.name || 'Premium Material',
            description: material.description || 'High-quality finish material',
            details: material.specifications || '',
            price: material.price || 0,
            quantity: material.quantity || 1,
            canEditQuantity: true,
            icon: '🎨'
          });
        });
      } catch (e) {
        console.error('Error parsing material orders:', e);
      }
    }
    
    setCartItems(items);
    setLoading(false);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    
    // Update localStorage for materials only
    const materialItems = updatedItems
      .filter(item => item.type === 'material')
      .map(({ id, type, icon, canEditQuantity, ...rest }) => rest);
    
    if (materialItems.length > 0) {
      localStorage.setItem('materialOrders', JSON.stringify(materialItems));
    }
  };

  const removeItem = (id) => {
    const item = cartItems.find(i => i.id === id);
    
    if (item.type === 'calculator') {
      localStorage.removeItem('pendingCalculatorOrder');
    } else {
      const remainingMaterials = cartItems
        .filter(i => i.type === 'material' && i.id !== id)
        .map(({ id, type, icon, canEditQuantity, ...rest }) => rest);
      
      if (remainingMaterials.length > 0) {
        localStorage.setItem('materialOrders', JSON.stringify(remainingMaterials));
      } else {
        localStorage.removeItem('materialOrders');
      }
    }
    
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      localStorage.removeItem('pendingCalculatorOrder');
      localStorage.removeItem('materialOrders');
      setCartItems([]);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
  const total = subtotal + tax + shipping;

  const hasCalculatorConfig = cartItems.some(item => item.type === 'calculator');
  const hasMaterials = cartItems.some(item => item.type === 'material');

  if (loading) {
    return (
      <div style={{ marginTop: '180px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner">Loading cart...</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '180px', minHeight: '80vh', padding: '40px 20px' }}>
      <style jsx>{`
        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Roboto Mono', monospace;
        }

        .cart-header {
          text-align: center;
          margin-bottom: 50px;
          padding-bottom: 30px;
          border-bottom: 2px solid #D1C6B4;
        }

        .cart-title {
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 300;
          letter-spacing: 15px;
          color: #232320;
          margin-bottom: 10px;
        }

        .cart-subtitle {
          font-size: 14px;
          color: #A1A2A0;
          letter-spacing: 2px;
        }

        .add-more-section {
          background: linear-gradient(135deg, #EFEEE1 0%, #FAFAFA 100%);
          padding: 25px;
          margin-bottom: 30px;
          border: 1px solid #D1C6B4;
          text-align: center;
        }

        .add-more-title {
          font-size: 16px;
          color: #232320;
          margin-bottom: 20px;
          letter-spacing: 1px;
        }

        .add-more-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 25px;
          background: white;
          color: #232320;
          text-decoration: none;
          border: 2px solid #232320;
          font-size: 13px;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .add-btn:hover {
          background: #232320;
          color: white;
          transform: translateY(-2px);
        }

        .add-btn.gold {
          border-color: #B19359;
          color: #B19359;
        }

        .add-btn.gold:hover {
          background: #B19359;
          color: white;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (min-width: 968px) {
          .cart-content {
            grid-template-columns: 2fr 1fr;
          }
        }

        .cart-items {
          background: white;
          border: 1px solid #D1C6B4;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .empty-cart {
          text-align: center;
          padding: 80px 20px;
          color: #A1A2A0;
        }

        .empty-icon {
          font-size: 72px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-cart h3 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #232320;
          letter-spacing: 2px;
        }

        .empty-cart p {
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .empty-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cart-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          padding: 25px;
          border: 1px solid #EFEEE1;
          margin-bottom: 20px;
          background: #FAFAFA;
          transition: all 0.3s ease;
          position: relative;
        }

        .cart-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .item-type-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #B19359;
  color: white;
  padding: 4px 12px;
  font-size: 11px;
  letter-spacing: 1px;
  border-radius: 2px;
  margin-bottom: 15px;  /* Added more space */
}

        .item-type-badge.material {
          background: #34499E;
        }

.item-image {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #EFEEE1 0%, #D1C6B4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #232320;
  border: 1px solid #D1C6B4;
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .item-type-badge {
    position: static;
    display: inline-block;
    margin-bottom: 15px;
  }
  
  .item-image {
    width: 100%;
    height: 150px;
  }
  
  .item-price-section {
    text-align: left;
    padding-top: 20px;
    border-top: 1px solid #EFEEE1;
  }
}

        .item-details {
          flex: 1;
        }

        .item-name {
          font-size: 18px;
          font-weight: 500;
          color: #232320;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .item-description {
          font-size: 14px;
          color: #A1A2A0;
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .item-details-text {
          font-size: 12px;
          color: #B19359;
          margin-bottom: 15px;
          font-style: italic;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid #D1C6B4;
          background: white;
        }

        .quantity-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: white;
          color: #232320;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #EFEEE1;
        }

        .quantity-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .quantity-input {
          width: 50px;
          height: 36px;
          border: none;
          border-left: 1px solid #D1C6B4;
          border-right: 1px solid #D1C6B4;
          text-align: center;
          font-family: 'Roboto Mono', monospace;
        }

        .quantity-input:disabled {
          background: #F5F5F5;
          color: #A1A2A0;
        }

        .quantity-fixed {
          padding: 8px 16px;
          background: #EFEEE1;
          border: 1px solid #D1C6B4;
          font-size: 14px;
          color: #232320;
        }

        .item-price-section {
          text-align: right;
        }

        @media (max-width: 640px) {
          .item-price-section {
            text-align: left;
            padding-top: 15px;
            border-top: 1px solid #EFEEE1;
          }
        }

       .item-price {
  font-size: 20px;  /* Reduced from 24px */
  font-weight: 500;
  color: #232320;
  margin-bottom: 10px;
  margin-top: 8px;  /* Added spacing from badge */
}
        .remove-btn {
          background: none;
          border: none;
          color: #B19359;
          cursor: pointer;
          font-size: 14px;
          padding: 5px;
          transition: color 0.3s ease;
          text-decoration: underline;
        }

        .remove-btn:hover {
          color: #232320;
        }

        .cart-summary {
          background: #232320;
          color: white;
          padding: 40px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        @media (max-width: 967px) {
          .cart-summary {
            position: relative;
            top: 0;
          }
        }

        .summary-title {
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 4px;
          margin-bottom: 30px;
          text-align: center;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 14px;
        }

        .summary-line.total {
          border-bottom: none;
          border-top: 2px solid #B19359;
          margin-top: 20px;
          padding-top: 20px;
          font-size: 20px;
          font-weight: 500;
        }

        .shipping-note {
          font-size: 12px;
          color: #B19359;
          text-align: center;
          margin-top: 20px;
        }

        .checkout-btn {
          width: 100%;
          padding: 18px;
          background: #B19359;
          color: white;
          border: none;
          font-size: 16px;
          letter-spacing: 2px;
          cursor: pointer;
          margin-top: 30px;
          transition: all 0.3s ease;
          font-family: 'Roboto Mono', monospace;
        }

        .checkout-btn:hover {
          background: #34499E;
          transform: translateY(-2px);
        }

        .checkout-btn:disabled {
          background: #A1A2A0;
          cursor: not-allowed;
        }

        .continue-shopping {
          text-align: center;
          margin-top: 20px;
        }

        .continue-shopping a {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .continue-shopping a:hover {
          color: #B19359;
        }

        .cart-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #EFEEE1;
        }

        .clear-cart-btn {
          background: none;
          border: 1px solid #D1C6B4;
          padding: 10px 20px;
          color: #A1A2A0;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: 'Roboto Mono', monospace;
        }

        .clear-cart-btn:hover {
          border-color: #FF4444;
          color: #FF4444;
          background: #FFF5F5;
        }

        .btn {
          display: inline-block;
          padding: 14px 35px;
          background: #232320;
          color: white;
          text-decoration: none;
          letter-spacing: 2px;
          font-size: 14px;
          transition: all 0.3s ease;
          border: 2px solid #232320;
        }

        .btn:hover {
          background: transparent;
          color: #232320;
        }

        .loading-spinner {
          font-size: 18px;
          color: #A1A2A0;
        }
      `}</style>

      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">SHOPPING CART</h1>
          <p className="cart-subtitle">{cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'} IN YOUR CART</p>
        </div>

        {cartItems.length > 0 && (
          <div className="add-more-section">
            <h3 className="add-more-title">Need to add more items?</h3>
            <div className="add-more-buttons">
              {!hasCalculatorConfig && (
                <a href="/calculator" className="add-btn">
                  <span>📐</span>
                  <span>Configure Wall System</span>
                </a>
              )}
              <a href="/materials" className="add-btn gold">
                <span>🎨</span>
                <span>Browse More Materials</span>
              </a>
            </div>
          </div>
        )}

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h3>YOUR CART IS EMPTY</h3>
                <p>Start by configuring a custom wall system or browsing our premium materials collection.</p>
                <div className="empty-actions">
                  <a href="/calculator" className="btn">CONFIGURE WALLS</a>
                  <a href="/materials" className="add-btn gold">BROWSE MATERIALS</a>
                </div>
              </div>
            ) : (
              <>
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <span className={`item-type-badge ${item.type}`}>
                      {item.type === 'calculator' ? 'CONFIGURATION' : 'MATERIAL'}
                    </span>
                    
                    <div className="item-image">
                      {item.icon}
                    </div>
                    
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      {item.details && (
                        <p className="item-details-text">{item.details}</p>
                      )}
                      
                      <div className="item-actions">
                        {item.canEditQuantity ? (
                          <div className="quantity-control">
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <input 
                              type="number" 
                              className="quantity-input"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                            />
                            <button 
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <div className="quantity-fixed">
                            Qty: {item.quantity}
                          </div>
                        )}
                        
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-price-section">
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.quantity > 1 && (
                        <div style={{ fontSize: '12px', color: '#A1A2A0' }}>
                          ${item.price.toFixed(2)} each
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {cartItems.length > 0 && (
                  <div className="cart-actions">
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Clear All Items
                    </button>
                    <div style={{ fontSize: '14px', color: '#A1A2A0' }}>
                      {hasCalculatorConfig && hasMaterials 
                        ? 'Configuration + Materials' 
                        : hasCalculatorConfig 
                        ? 'Wall Configuration Ready' 
                        : 'Materials Selected'}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-summary">
              <h2 className="summary-title">ORDER SUMMARY</h2>
              
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-line total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              {shipping > 0 && (
                <p className="shipping-note">
                  🎁 Free shipping on orders over $500<br/>
                  Add ${(500 - subtotal).toFixed(2)} more to qualify
                </p>
              )}
              
              <button 
                className="checkout-btn"
                onClick={() => alert('Checkout functionality coming soon! We will integrate Stripe payment processing here.')}
              >
                PROCEED TO CHECKOUT
              </button>
              
              <div className="continue-shopping">
                <a href="/materials">← Continue Shopping</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}