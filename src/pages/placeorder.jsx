import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets/frontend_assets/assets'

const Placeorder = () => {
  const { cartItems } = useContext(ShopContext)
  const [method, setMethod] = useState('cod')
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingFee = cartItems.length > 0 ? 10 : 0
  const totalAmount = subtotal + shippingFee

  return (
    <div style={{ padding: '40px 6%' }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '60px',
        flexWrap: 'wrap'
      }}>

        {/* LEFT SIDE */}
        <div style={{ flex: '1', minWidth: '320px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '500' }}>
              DELIVERY <b>INFORMATION</b>
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'black' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
            <input placeholder='First name' style={inputStyle} />
            <input placeholder='Last name' style={inputStyle} />
          </div>

          <input placeholder='Email address' style={fullInputStyle} />
          <input placeholder='Street' style={fullInputStyle} />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
            <input placeholder='City' style={inputStyle} />
            <input placeholder='State' style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
            <input placeholder='Zipcode' style={inputStyle} />
            <input placeholder='Country' style={inputStyle} />
          </div>

          <input placeholder='Phone' style={fullInputStyle} />

        </div>

        {/* RIGHT SIDE */}
        <div style={{ flex: '1', minWidth: '320px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '500' }}>
              CART <b>TOTALS</b>
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'black' }}></div>
          </div>

          <div style={rowStyle}>
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>

          <div style={rowStyle}>
            <p>Shipping Fee</p>
            <p>${shippingFee.toFixed(2)}</p>
          </div>

          <div style={{ ...rowStyle, fontWeight: 'bold', borderBottom: 'none' }}>
            <p>Total</p>
            <p>${totalAmount.toFixed(2)}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '45px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '500' }}>
              PAYMENT <b>METHOD</b>
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'black' }}></div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '35px'
          }}>

            <button onClick={() => setMethod('stripe')} style={paymentStyle}>
              <span style={circleStyle(method === 'stripe')}></span>
              <img src={assets.stripe_logo} alt='' style={{ height: '20px' }} />
            </button>

            <button onClick={() => setMethod('razorpay')} style={paymentStyle}>
              <span style={circleStyle(method === 'razorpay')}></span>
              <img src={assets.razorpay_logo} alt='' style={{ height: '20px' }} />
            </button>

            <button onClick={() => setMethod('cod')} style={paymentStyle}>
              <span style={circleStyle(method === 'cod')}></span>
              <p>CASH ON DELIVERY</p>
            </button>

          </div>

          <button
            onClick={() => navigate('/orders')}
            style={{
              background: 'black',
              color: 'white',
              border: 'none',
              padding: '16px 60px',
              cursor: 'pointer',
              float: 'right'
            }}
          >
            PLACE ORDER
          </button>

        </div>

      </div>

    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  border: '1px solid #ccc',
  outline: 'none'
}

const fullInputStyle = {
  width: '100%',
  padding: '14px',
  border: '1px solid #ccc',
  outline: 'none',
  marginBottom: '15px'
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #ddd',
  padding: '12px 0'
}

const paymentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 20px',
  border: '1px solid #ddd',
  background: 'white',
  cursor: 'pointer'
}

const circleStyle = (active) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  border: active ? 'none' : '1px solid #ccc',
  background: active ? '#22c55e' : 'white'
})

export default Placeorder