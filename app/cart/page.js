'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [calculatorOrder, setCalculatorOrder] = useState(null);
  const [materialOrders, setMaterialOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      try {
        // Load calculator configuration
        const calcOrder = localStorage.getItem('pendingCalculatorOrder');
        if (calcOrder) {
          setCalculatorOrder(JSON.parse(calcOrder));
        }

        // Load material orders
        const matOrders = localStorage.getItem('materialOrders');
        if (matOrders) {
          setMaterialOrders(JSON.parse(matOrders));
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, []);

  const removeCalculatorOrder = () => {
    localStorage.removeItem('pendingCalculatorOrder');
    setCalculatorOrder(null);
  };

  const removeMaterialOrder = (index) => {
    const updatedOrders = materialOrders.filter((_, i) => i !== index);
    setMaterialOrders(updatedOrders);
    localStorage.setItem('materialOrders', JSON.stringify(updatedOrders));
  };

  const clearCart = () => {
    localStorage.removeItem('pendingCalculatorOrder');
    localStorage.removeItem('materialOrders');
    setCalculatorOrder(null);
    setMaterialOrders([]);
  };

  const getTotal = () => {
    let total = 0;
    if (calculatorOrder?.costEstimate?.total) {
      total += calculatorOrder.costEstimate.total;
    }
    materialOrders.forEach(order => {
      if (order.price) total += order.price;
    });
    return total;
  };

  const proceedToCheckout = () => {
    // In a real app, this would go to checkout
    alert('Checkout functionality will be implemented with Stripe integration');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#34499E] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !calculatorOrder && materialOrders.length === 0;

  return (
    <div className="min-h-screen bg-[#EFEEE1] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#232320] mb-8 tracking-wider uppercase">
          Your Cart
        </h1>

        {isEmpty ? (
          <div className="bg-white p-12 text-center shadow-sm">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add items from the calculator or materials catalog</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/calculator')}
                className="px-6 py-3 bg-[#34499E] text-white font-semibold tracking-wider uppercase hover:bg-[#232320] transition-colors"
              >
                Use Calculator
              </button>
              <button
                onClick={() => router.push('/materials')}
                className="px-6 py-3 bg-[#B19359] text-white font-semibold tracking-wider uppercase hover:bg-[#232320] transition-colors"
              >
                Browse Materials
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Calculator Order */}
            {calculatorOrder && (
              <div className="bg-white p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-[#232320]">Wall System Configuration</h2>
                  <button
                    onClick={removeCalculatorOrder}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Name:</span>
                    <span className="font-medium">{calculatorOrder.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{calculatorOrder.material}</span>
                  </div>
                  {calculatorOrder.materialDetail && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Finish:</span>
                      <span className="font-medium">{calculatorOrder.materialDetail}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile:</span>
                    <span className="font-medium capitalize">{calculatorOrder.profile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage:</span>
                    <span className="font-medium">
                      {calculatorOrder.coverage === 'full' ? 'Full Height' : `Wainscot ${calculatorOrder.coverageHeight}"`}
                    </span>
                  </div>
                  {calculatorOrder.walls && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Walls:</span>
                      <span className="font-medium">{calculatorOrder.walls.length}</span>
                    </div>
                  )}
                </div>

                {calculatorOrder.costEstimate && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Estimated Total:</span>
                      <span className="text-[#34499E]">
                        ${calculatorOrder.costEstimate.total?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Material Orders */}
            {materialOrders.map((order, index) => (
              <div key={index} className="bg-white p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-[#232320]">{order.name || 'Material Order'}</h2>
                  <button
                    onClick={() => removeMaterialOrder(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  {order.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{order.description}</span>
                    </div>
                  )}
                  {order.quantity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{order.quantity}</span>
                    </div>
                  )}
                </div>

                {order.price && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Price:</span>
                      <span className="text-[#34499E]">${order.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Cart Summary */}
            <div className="bg-[#232320] text-[#EFEEE1] p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                {calculatorOrder && (
                  <div className="flex justify-between">
                    <span>Wall System Configuration</span>
                    <span>${calculatorOrder.costEstimate?.total?.toFixed(2) || '0.00'}</span>
                  </div>
                )}
                {materialOrders.map((order, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{order.name || 'Material Order'}</span>
                    <span>${order.price?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#B19359]">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={proceedToCheckout}
                  className="w-full py-3 bg-[#B19359] text-white font-semibold tracking-wider uppercase hover:bg-[#34499E] transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-3 bg-transparent border border-[#EFEEE1] text-[#EFEEE1] font-semibold tracking-wider uppercase hover:bg-[#EFEEE1] hover:text-[#232320] transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}