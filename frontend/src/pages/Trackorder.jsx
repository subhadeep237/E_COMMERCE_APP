import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const TrackOrder = () => {
  const { id } = useParams()
  const { token, backendUrl, products } = useContext(ShopContext)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadOrder = async () => {
    try {
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get(
        backendUrl + '/api/order/' + id,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setOrder(response.data.order)
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [id, token])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProductDetails = (productId) => {
    return products.find((p) => p._id === productId)
  }

  // Timeline steps
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered']

  const getCurrentStep = (status) => {
    if (status === 'Cancelled') return -1
    return steps.indexOf(status)
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 6%' }}>
        <p>Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ padding: '40px 6%' }}>
        <p>Order not found.</p>
        <button
          onClick={() => navigate('/orders')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: 'black',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back to Orders
        </button>
      </div>
    )
  }

  const currentStep = getCurrentStep(order.orderStatus)

  return (
    <div style={{ padding: '40px 6%' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => navigate('/orders')}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            background: 'white',
            color: 'black',
            border: '1px solid #ddd',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          ← Back to Orders
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '10px'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: '500' }}>
            TRACK <b>ORDER</b>
          </h1>
          <div style={{ width: '70px', height: '2px', background: 'black' }}></div>
        </div>

        <p style={{ color: '#555', fontSize: '14px' }}>
          Order ID: <b>{order._id}</b>
        </p>
      </div>

      {/* TIMELINE */}
      {order.orderStatus !== 'Cancelled' ? (
        <div style={{
          background: '#fafafa',
          padding: '40px 30px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '30px', fontWeight: '600' }}>
            Order Progress
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'relative'
          }}>

            {/* Progress line background */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '7%',
              right: '7%',
              height: '4px',
              background: '#e5e7eb',
              zIndex: 1
            }}></div>

            {/* Active progress line */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '7%',
              width: `${(currentStep / (steps.length - 1)) * 86}%`,
              height: '4px',
              background: '#22c55e',
              zIndex: 2,
              transition: '0.5s'
            }}></div>

            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 3,
                  flex: 1
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: index <= currentStep ? '#22c55e' : 'white',
                  border: index <= currentStep ? '3px solid #22c55e' : '3px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: index <= currentStep ? 'white' : '#999',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  transition: '0.3s'
                }}>
                  {index <= currentStep ? '✓' : index + 1}
                </div>
                <p style={{
                  marginTop: '10px',
                  fontWeight: index <= currentStep ? '600' : '400',
                  color: index <= currentStep ? '#22c55e' : '#777',
                  fontSize: '14px'
                }}>
                  {step}
                </p>
                {index === currentStep && (
                  <p style={{
                    marginTop: '5px',
                    fontSize: '12px',
                    color: '#22c55e'
                  }}>
                    Current Status
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fee2e2',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #ef4444'
        }}>
          <h2 style={{ color: '#ef4444', fontSize: '20px' }}>
            ❌ Order Cancelled
          </h2>
        </div>
      )}

      {/* Order Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={infoBoxStyle}>
          <p style={infoLabelStyle}>Order Date</p>
          <p style={infoValueStyle}>{formatDate(order.createdAt)}</p>
        </div>

        <div style={infoBoxStyle}>
          <p style={infoLabelStyle}>Payment Method</p>
          <p style={infoValueStyle}>{order.paymentMethod}</p>
        </div>

        <div style={infoBoxStyle}>
          <p style={infoLabelStyle}>Payment Status</p>
          <p style={{
            ...infoValueStyle,
            color: order.paymentStatus === 'Paid' ? '#22c55e' : '#f59e0b'
          }}>
            {order.paymentStatus}
          </p>
        </div>

        <div style={infoBoxStyle}>
          <p style={infoLabelStyle}>Total Amount</p>
          <p style={{ ...infoValueStyle, fontSize: '20px', color: '#000' }}>
            ${order.amount}
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      <div style={{
        background: '#fafafa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginBottom: '10px', fontWeight: '600' }}>📍 Delivery Address</h3>
        <p style={{ color: '#555', lineHeight: '24px' }}>{order.address}</p>
      </div>

      {/* Order Items */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>
          🛍️ Order Items ({order.items.length})
        </h3>

        {order.items.map((item, index) => {
          const product = getProductDetails(item.productId)

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '15px 0',
                borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none',
                alignItems: 'center'
              }}
            >
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

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                  {product ? product.name : 'Product'}
                </p>
                <p style={{ color: '#555', marginBottom: '5px' }}>
                  Size: <b>{item.size}</b> | Quantity: <b>{item.quantity}</b>
                </p>
                {product && (
                  <p style={{ fontWeight: 'bold' }}>${product.price}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

const infoBoxStyle = {
  background: '#fafafa',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #ddd'
}

const infoLabelStyle = {
  color: '#555',
  fontSize: '13px',
  marginBottom: '5px'
}

const infoValueStyle = {
  fontWeight: '600',
  fontSize: '15px'
}

export default TrackOrder