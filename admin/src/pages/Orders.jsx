import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = ({ token, backendUrl }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')

  const fetchAllOrders = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await axios.get(
        backendUrl + '/api/order/admin/all',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value

    try {
      const response = await axios.post(
        backendUrl + '/api/order/admin/status',
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        toast.success('Order status updated!')
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#fef3c7', color: '#92400e' }
      case 'Processing': return { bg: '#dbeafe', color: '#1e40af' }
      case 'Shipped': return { bg: '#e9d5ff', color: '#6b21a8' }
      case 'Delivered': return { bg: '#dcfce7', color: '#166534' }
      case 'Cancelled': return { bg: '#fee2e2', color: '#991b1b' }
      default: return { bg: '#f1f5f9', color: '#475569' }
    }
  }

  const filteredOrders = filter === 'All'
    ? orders
    : orders.filter((o) => o.orderStatus === filter)

  // Stats
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.amount, 0)

  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending').length
  const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length

  return (
    <div>

      <div style={{ marginBottom: '25px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '5px'
        }}>
          Orders Management
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={statCardStyle('#dbeafe')}>
          <p style={statLabelStyle}>Total Orders</p>
          <p style={statValueStyle}>{orders.length}</p>
          <p style={{ ...statBadgeStyle, color: '#1e40af' }}>📦 All Time</p>
        </div>

        <div style={statCardStyle('#fef3c7')}>
          <p style={statLabelStyle}>Pending Orders</p>
          <p style={statValueStyle}>{pendingCount}</p>
          <p style={{ ...statBadgeStyle, color: '#92400e' }}>⏳ Need Attention</p>
        </div>

        <div style={statCardStyle('#dcfce7')}>
          <p style={statLabelStyle}>Delivered</p>
          <p style={statValueStyle}>{deliveredCount}</p>
          <p style={{ ...statBadgeStyle, color: '#166534' }}>✅ Complete</p>
        </div>

        <div style={statCardStyle('#fce7f3')}>
          <p style={statLabelStyle}>Total Revenue</p>
          <p style={statValueStyle}>${totalRevenue}</p>
          <p style={{ ...statBadgeStyle, color: '#831843' }}>💰 Paid Orders</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 18px',
              border: filter === status ? 'none' : '1px solid #e2e8f0',
              background: filter === status ? 'linear-gradient(135deg, #000 0%, #333 100%)' : 'white',
              color: filter === status ? 'white' : '#475569',
              cursor: 'pointer',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              transition: '0.2s'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ color: '#64748b', padding: '20px' }}>Loading orders...</p>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          No orders found
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredOrders.map((order) => {
          const statusColor = getStatusColor(order.orderStatus)

          return (
            <div
              key={order._id}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9'
              }}
            >
              {/* Top Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '15px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '15px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <p style={{ color: '#64748b', fontSize: '12px' }}>Order ID</p>
                  <p style={{ fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <span style={{
                  padding: '6px 14px',
                  background: statusColor.bg,
                  color: statusColor.color,
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '20px'
                }}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Main Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 2fr 1fr 1.2fr',
                gap: '20px',
                alignItems: 'start'
              }}>

                {/* Date & Payment */}
                <div>
                  <p style={detailLabelStyle}>📅 Order Date</p>
                  <p style={detailValueStyle}>{formatDate(order.createdAt)}</p>

                  <p style={{ ...detailLabelStyle, marginTop: '12px' }}>💳 Payment</p>
                  <p style={detailValueStyle}>{order.paymentMethod}</p>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: order.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                    color: order.paymentStatus === 'Paid' ? '#166534' : '#92400e'
                  }}>
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Items */}
                <div>
                  <p style={detailLabelStyle}>🛍️ Items ({order.items?.length})</p>
                  {order.items?.map((item, index) => (
                    <p key={index} style={{ ...detailValueStyle, marginBottom: '4px' }}>
                      • Size <b>{item.size}</b> — Qty: <b>{item.quantity}</b>
                    </p>
                  ))}
                </div>

                {/* Amount */}
                <div>
                  <p style={detailLabelStyle}>💰 Total Amount</p>
                  <p style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#0f172a',
                    marginTop: '4px'
                  }}>
                    ${order.amount}
                  </p>
                </div>

                {/* Status Dropdown */}
                <div>
                  <p style={detailLabelStyle}>Update Status</p>
                  <select
                    value={order.orderStatus || 'Pending'}
                    onChange={(e) => handleStatusChange(e, order._id)}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      color: '#1e293b',
                      cursor: 'pointer',
                      width: '100%',
                      fontSize: '13px',
                      fontWeight: '500',
                      marginTop: '4px',
                      outline: 'none'
                    }}
                  >
                    <option value='Pending'>Pending</option>
                    <option value='Processing'>Processing</option>
                    <option value='Shipped'>Shipped</option>
                    <option value='Delivered'>Delivered</option>
                    <option value='Cancelled'>Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Shipping Address */}
              <div style={{
                marginTop: '15px',
                padding: '12px 15px',
                background: '#f8fafc',
                borderRadius: '6px'
              }}>
                <p style={detailLabelStyle}>📍 Shipping Address</p>
                <p style={{
                  fontSize: '13px',
                  color: '#475569',
                  marginTop: '4px',
                  lineHeight: '1.5'
                }}>
                  {order.address}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const statCardStyle = (bgColor) => ({
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  border: `2px solid ${bgColor}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
})

const statLabelStyle = {
  fontSize: '12px',
  color: '#64748b',
  fontWeight: '500',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}

const statValueStyle = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '6px'
}

const statBadgeStyle = {
  fontSize: '11px',
  fontWeight: '600'
}

const detailLabelStyle = {
  fontSize: '11px',
  color: '#64748b',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '4px'
}

const detailValueStyle = {
  fontSize: '13px',
  color: '#1e293b',
  fontWeight: '500'
}

export default Orders