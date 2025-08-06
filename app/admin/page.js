'use client'

import { Button } from '../components/button'
import { Badge } from '../components/badge'
import { Table } from '../components/table'
import { Select } from '../components/select'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch orders from Supabase
  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
  .from('orders')
  .select('*')
  .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
  console.error('Error fetching orders:', error.message || error)
  alert('Error: ' + (error.message || 'Unknown error'))
} finally {
      setLoading(false)
    }
  }

  // Update order status
  async function updateOrderStatus(orderId, newStatus) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      
      // Refresh orders
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const statusColors = {
    'pending': 'yellow',
    'in_production': 'blue',
    'completed': 'green',
    'shipped': 'purple',
    'cancelled': 'red'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFEEE1] flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#EFEEE1]">
      {/* Header */}
      <header className="bg-[#232320] text-[#EFEEE1] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-light">Order Management</h1>
          <p className="text-sm opacity-80 mt-2">House of HALKETT Admin</p>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-[#232320]">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">In Production</h3>
              <p className="text-3xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'in_production').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm text-gray-600 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-gray-900">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Order ID</th>
                    <th className="text-left p-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left p-4 font-medium text-gray-700">Total</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.profiles?.full_name || 'Guest'}</p>
                          <p className="text-sm text-gray-600">{order.profiles?.email}</p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
                        ${order.total_amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="p-4">
                        <Badge color={statusColors[order.status] || 'gray'}>
                          {order.status?.replace('_', ' ') || 'pending'}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <select 
                            className="text-sm border rounded px-2 py-1"
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_production">In Production</option>
                            <option value="completed">Completed</option>
                            <option value="shipped">Shipped</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
