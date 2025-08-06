'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/app/components/badge'
import { Button } from '@/app/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/components/dialog'
import { Select } from '@/app/components/select'
import { Input } from '@/app/components/input'
import { Textarea } from '@/app/components/textarea'
import { Field, Label } from '@/app/components/fieldset'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/table'
import { supabase } from '@/app/lib/supabase'

export default function KanbanDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [draggedOrder, setDraggedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Order statuses for Kanban columns
  const orderStatuses = [
    { id: 'new', label: 'New Orders', color: 'bg-blue-600 text-white' },
    { id: 'confirmed', label: 'Confirmed', color: 'bg-gray-800 text-white' },
    { id: 'production', label: 'In Production', color: 'bg-yellow-700 text-white' },
    { id: 'finishing', label: 'Finishing', color: 'bg-orange-600 text-white' },
    { id: 'shipping', label: 'Shipping', color: 'bg-purple-600 text-white' },
    { id: 'delivered', label: 'Delivered', color: 'bg-green-600 text-white' }
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      // First, let's just get the orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError
      
      // Then get profiles separately if needed
      if (ordersData && ordersData.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(ordersData.map(order => order.user_id).filter(id => id))]
        
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds)
          
          // Merge profiles with orders
          const ordersWithProfiles = ordersData.map(order => ({
            ...order,
            profiles: profilesData?.find(profile => profile.id === order.user_id) || null
          }))
          
          setOrders(ordersWithProfiles)
          console.log('Orders loaded:', ordersWithProfiles)
        } else {
          setOrders(ordersData)
          console.log('Orders loaded:', ordersData)
        }
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message || error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (orderError) throw orderError

      // Add status update record
      const { error: statusError } = await supabase
        .from('status_updates')
        .insert({
          order_id: orderId,
          status: newStatus,
          notes: `Status changed to ${newStatus}`
        })

      if (statusError) throw statusError

      // Refresh orders
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleDragStart = (order) => {
    setDraggedOrder(order)
  }

  const handleDragEnd = () => {
    setDraggedOrder(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    if (draggedOrder && draggedOrder.status !== status) {
      updateOrderStatus(draggedOrder.id, status)
    }
  }

  const getOrdersByStatus = (status) => {
    return orders.filter(order => {
      const matchesStatus = order.status === status || (status === 'new' && order.status === 'quote')
      const matchesSearch = searchTerm === '' || 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.profiles?.company?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesStatus && matchesSearch
    })
  }

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Loading orders...</h2>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#EFEEE1', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#232320' }}>
          Order Management Dashboard
        </h1>
        
        {/* Filters and Search */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#232320' }}>
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by order number, customer, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #D1C6B4',
                backgroundColor: 'white',
                fontSize: '14px',
                color: '#232320'
              }}
            />
          </div>
          
          <div style={{ minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#232320' }}>
              View Mode
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '2px solid #D1C6B4',
                backgroundColor: 'white',
                fontSize: '14px',
                color: '#232320'
              }}
            >
              <option value="all">Kanban Board</option>
              <option value="table">Table View</option>
            </select>
          </div>
        </div>

        {/* Update Quote Status Button */}
        <button 
          onClick={async () => {
            try {
              const { error } = await supabase
                .from('orders')
                .update({ status: 'new' })
                .eq('status', 'quote')
              
              if (error) {
                alert('Error updating: ' + error.message)
              } else {
                alert('Orders updated! Refreshing...')
                fetchOrders()
              }
            } catch (err) {
              alert('Error: ' + err.message)
            }
          }}
          style={{
            backgroundColor: '#34499E',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Update Quote Orders to New
        </button>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {orderStatuses.map(status => {
            const count = getOrdersByStatus(status.id).length
            return (
              <div key={status.id} style={{ 
                backgroundColor: 'white', 
                padding: '16px', 
                textAlign: 'center',
                border: '1px solid #D1C6B4'
              }}>
                <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#666', textTransform: 'uppercase' }}>
                  {status.label}
                </h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#232320' }}>{count}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Kanban Board */}
      {statusFilter === 'all' ? (
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto', 
          paddingBottom: '20px',
          minHeight: '600px'
        }}>
          {orderStatuses.map(status => (
            <div
              key={status.id}
              style={{ 
                flex: '0 0 300px',
                backgroundColor: 'white',
                border: '2px solid #D1C6B4',
                padding: '16px',
                minHeight: '500px'
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.id)}
            >
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '14px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px', 
                marginBottom: '16px', 
                paddingBottom: '8px', 
                borderBottom: '2px solid #232320',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#232320'
              }}>
                <span>{status.label}</span>
                <span className={`${status.color}`} style={{ 
                  padding: '2px 8px', 
                  fontSize: '12px',
                  borderRadius: '4px'
                }}>
                  {getOrdersByStatus(status.id).length}
                </span>
              </div>
              
              <div>
                {getOrdersByStatus(status.id).map(order => (
                  <div
                    key={order.id}
                    style={{ 
                      backgroundColor: 'white',
                      border: '2px solid #D1C6B4',
                      padding: '12px',
                      marginBottom: '12px',
                      cursor: 'move',
                      transition: 'all 0.2s',
                      color: '#232320',
                      opacity: draggedOrder?.id === order.id ? '0.5' : '1',
                      transform: draggedOrder?.id === order.id ? 'rotate(3deg)' : 'none'
                    }}
                    draggable
                    onDragStart={() => handleDragStart(order)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      setSelectedOrder(order)
                      setIsDialogOpen(true)
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#A1A2A0'
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#D1C6B4'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '14px', color: '#232320' }}>
                          #{order.order_number}
                        </h4>
                        <span style={{ 
                          backgroundColor: '#232320', 
                          color: '#EFEEE1', 
                          padding: '2px 6px', 
                          fontSize: '10px',
                          textTransform: 'uppercase'
                        }}>
                          {order.source === 'calculator' ? 'Modular' : 'Materials'}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                        {order.profiles?.full_name || 'Guest'}
                      </p>
                      {order.profiles?.company && (
                        <p style={{ fontSize: '12px', color: '#999' }}>{order.profiles.company}</p>
                      )}
                    </div>
                    
                    <div style={{ fontSize: '13px' }}>
                      <p style={{ fontWeight: '600', color: '#232320' }}>{formatCurrency(order.total_price)}</p>
                      <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>{formatDate(order.created_at)}</p>
                    </div>
                    
                    {order.configuration && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
                        <p>Width: {order.configuration.width}"</p>
                        <p>Height: {order.configuration.height}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div style={{ backgroundColor: 'white', border: '1px solid #D1C6B4', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#232320' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Order #</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Company</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Total</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#EFEEE1', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                    <td style={{ padding: '12px', color: '#232320', fontWeight: 'bold' }}>#{order.order_number}</td>
                    <td style={{ padding: '12px', color: '#232320' }}>{order.profiles?.full_name || 'Guest'}</td>
                    <td style={{ padding: '12px', color: '#232320' }}>{order.profiles?.company || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        backgroundColor: '#232320', 
                        color: '#EFEEE1', 
                        padding: '2px 8px', 
                        fontSize: '11px',
                        textTransform: 'uppercase'
                      }}>
                        {order.source === 'calculator' ? 'Modular' : 'Materials'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#232320', fontWeight: '600' }}>{formatCurrency(order.total_price)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        backgroundColor: order.status === 'quote' || order.status === 'new' ? '#34499E' : '#666', 
                        color: 'white', 
                        padding: '2px 8px', 
                        fontSize: '11px',
                        textTransform: 'uppercase'
                      }}>
                        {order.status === 'quote' ? 'new' : order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#232320' }}>{formatDate(order.created_at)}</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDialogOpen(true)
                        }}
                        style={{
                          backgroundColor: '#34499E',
                          color: 'white',
                          padding: '4px 12px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        {selectedOrder && (
          <>
            <DialogTitle>Order #{selectedOrder.order_number}</DialogTitle>
            <DialogDescription>
              Created on {formatDate(selectedOrder.created_at)}
            </DialogDescription>
            
            <DialogBody>
              <div className="space-y-4">
                {/* Customer Info */}
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#232320' }}>Customer Information</h3>
                  <p style={{ color: '#232320' }}>Name: {selectedOrder.profiles?.full_name || 'Guest'}</p>
                  <p style={{ color: '#232320' }}>Email: {selectedOrder.profiles?.email || 'N/A'}</p>
                  <p style={{ color: '#232320' }}>Company: {selectedOrder.profiles?.company || 'N/A'}</p>
                </div>

                {/* Order Details */}
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#232320' }}>Order Details</h3>
                  <p style={{ color: '#232320' }}>Type: {selectedOrder.source === 'calculator' ? 'Modular System' : 'Materials'}</p>
                  <p style={{ color: '#232320' }}>Total: {formatCurrency(selectedOrder.total_price)}</p>
                  <p style={{ color: '#232320' }}>Status: <span style={{ 
                    backgroundColor: '#34499E', 
                    color: 'white', 
                    padding: '2px 8px', 
                    fontSize: '11px',
                    textTransform: 'uppercase'
                  }}>{selectedOrder.status === 'quote' ? 'new' : selectedOrder.status}</span></p>
                </div>

                {/* Configuration (if from calculator) */}
                {selectedOrder.configuration && (
                  <div>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#232320' }}>Configuration</h3>
                    <p style={{ color: '#232320' }}>Width: {selectedOrder.configuration.width}"</p>
                    <p style={{ color: '#232320' }}>Height: {selectedOrder.configuration.height}"</p>
                    <p style={{ color: '#232320' }}>Material: {selectedOrder.configuration.baseMaterial}</p>
                    <p style={{ color: '#232320' }}>Finish: {selectedOrder.configuration.finish}</p>
                  </div>
                )}

                {/* Status History */}
                {selectedOrder.status_updates && selectedOrder.status_updates.length > 0 && (
                  <div>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#232320' }}>Status History</h3>
                    <div className="space-y-2">
                      {selectedOrder.status_updates.map((update, index) => (
                        <div key={index} style={{ fontSize: '14px' }}>
                          <p style={{ fontWeight: '600', color: '#232320' }}>{update.status}</p>
                          <p style={{ color: '#666' }}>{update.notes}</p>
                          <p style={{ fontSize: '12px', color: '#999' }}>{formatDate(update.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Update Status */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#232320' }}>Update Status</label>
                  <select
                    value={selectedOrder.status === 'quote' ? 'new' : selectedOrder.status}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder.id, e.target.value)
                      setIsDialogOpen(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #D1C6B4',
                      backgroundColor: 'white',
                      color: '#232320'
                    }}
                  >
                    {orderStatuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </DialogBody>
            
            <DialogActions>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button variant="primary">
                Print Order
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  )
}