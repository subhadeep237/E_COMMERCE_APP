import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const Orders = () => {
  const { token, backendUrl, products } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadOrders = async () => {
    try {
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.post(
        backendUrl + '/api/order/user-orders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [token])

  // Cancel order function
  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        alert('Order cancelled successfully')
        await loadOrders()
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  const getProductDetails = (productId) => {
    return products.find((p) => p._id === productId)
  }

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
      case 'Pending': return '#f59e0b'
      case 'Processing': return '#3b82f6'
      case 'Shipped': return '#8b5cf6'
      case 'Delivered': return '#22c55e'
      case 'Cancelled': return '#ef4444'
      default: return '#777'
    }
  }

  // Check if order is cancellable
  const canCancel = (status) => {
    return status === 'Pending' || status === 'Processing'
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 6%' }}>
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 6%' }}>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '35px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '500' }}>
          MY <b>ORDERS</b>
        </h1>
        <div style={{ width: '70px', height: '2px', background: 'black' }}></div>
      </div>

      {!token ? (
        <p>Please login to view your orders.</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order, orderIndex) => (
          <div
            key={orderIndex}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '25px',
              background: '#fafafa'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '15px',
              marginBottom: '15px'
            }}>
              <div>
                <p style={{ color: '#555', fontSize: '14px' }}>Order ID:</p>
                <p style={{ fontWeight: '600', fontSize: '14px' }}>{order._id}</p>
              </div>
              <div>
                <p style={{ color: '#555', fontSize: '14px' }}>Order Date:</p>
                <p style={{ fontWeight: '600' }}>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p style={{ color: '#555', fontSize: '14px' }}>Payment:</p>
                <p style={{ fontWeight: '600' }}>
                  {order.paymentMethod} - <span style={{ color: order.paymentStatus === 'Paid' ? '#22c55e' : order.paymentStatus === 'Refund Pending' ? '#3b82f6' : '#f59e0b' }}>{order.paymentStatus}</span>
                </p>
              </div>
              <div>
                <p style={{ color: '#555', fontSize: '14px' }}>Total:</p>
                <p style={{ fontWeight: '600', fontSize: '18px' }}>${order.amount}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '12px',
                  height: '12px',
                  background: getStatusColor(order.orderStatus),
                  borderRadius: '50%'
                }}></span>
                <p style={{ fontWeight: '600' }}>{order.orderStatus}</p>
              </div>
            </div>

            {order.items.map((item, index) => {
              const product = getProductDetails(item.productId)

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {product && product.image && (
                      <img
                        src={product.image[0]}
                        alt=''
                        style={{
                          width: '80px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    )}

                    <div>
                      <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '500' }}>
                        {product ? product.name : 'Product'}
                      </p>

                      <p style={{ marginBottom: '5px', color: '#555' }}>
                        <span style={{ marginRight: '15px' }}>Quantity: {item.quantity}</span>
                        <span>Size: {item.size}</span>
                      </p>

                      {product && (
                        <p style={{ fontWeight: 'bold' }}>${product.price}</p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigate('/orders/track/' + order._id)}
                      style={{
                        border: '1px solid black',
                        background: 'black',
                        color: 'white',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      Track Order
                    </button>

                    {/* Cancel button - only for Pending/Processing orders */}
                    {canCancel(order.orderStatus) && index === 0 && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        style={{
                          border: '1px solid #ef4444',
                          background: '#fee2e2',
                          color: '#dc2626',
                          padding: '10px 20px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}

export default Orders