import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets/frontend_assets/assets'
import axios from 'axios'

const Placeorder = () => {
  const { cartItems, setCartItems, token, backendUrl } = useContext(ShopContext)
  const [method, setMethod] = useState('cod')
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(data => ({ ...data, [name]: value }))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingFee = cartItems.length > 0 ? 10 : 0
  const totalAmount = subtotal + shippingFee

  const onSubmitHandler = async () => {

    // Check if user is logged in
    if (!token) {
      alert('Please login first')
      navigate('/login')
      return
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      navigate('/cart')
      return
    }

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.street ||
        !formData.city || !formData.state || !formData.zipcode || !formData.country || !formData.phone) {
      alert('Please fill all delivery details')
      return
    }

    // Prepare order items
    const orderItems = cartItems.map(item => ({
      productId: item._id,
      size: item.size,
      quantity: item.quantity
    }))

    // Prepare address as string
    const address = `${formData.firstName} ${formData.lastName}, ${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipcode}, ${formData.country}. Phone: ${formData.phone}, Email: ${formData.email}`

    try {

      if (method === 'cod') {
        // ============ COD ORDER ============
        const response = await axios.post(
          backendUrl + '/api/order/place',
          {
            items: orderItems,
            amount: totalAmount,
            address: address,
            paymentMethod: 'COD'
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (response.data.success) {
          alert('Order placed successfully!')
          setCartItems([])
          navigate('/orders')
        } else {
          alert(response.data.message)
        }

      } else if (method === 'razorpay') {
        // ============ RAZORPAY ORDER ============
        const response = await axios.post(
          backendUrl + '/api/order/razorpay',
          {
            items: orderItems,
            amount: totalAmount,
            address: address
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (response.data.success) {
          initiateRazorpayPayment(response.data.order, response.data.orderId)
        } else {
          alert(response.data.message)
        }

      } else if (method === 'stripe') {
        alert('Stripe payment coming soon!')
      }

    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  // ============ RAZORPAY POPUP ============
  const initiateRazorpayPayment = (order, orderId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Forever',
      description: 'Order Payment',
      order_id: order.id,
      handler: async (response) => {
        // Payment completed - verify it
        try {
          const verifyResponse = await axios.post(
            backendUrl + '/api/order/verify-razorpay',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          if (verifyResponse.data.success) {
            alert('Payment successful! Order placed.')
            setCartItems([])
            navigate('/orders')
          } else {
            alert('Payment verification failed')
          }
        } catch (error) {
          console.log(error)
          alert(error.message)
        }
      },
      prefill: {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: '#000000'
      }
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

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
            <input name='firstName' value={formData.firstName} onChange={onChangeHandler} placeholder='First name' style={inputStyle} />
            <input name='lastName' value={formData.lastName} onChange={onChangeHandler} placeholder='Last name' style={inputStyle} />
          </div>

          <input name='email' value={formData.email} onChange={onChangeHandler} placeholder='Email address' style={fullInputStyle} />
          <input name='street' value={formData.street} onChange={onChangeHandler} placeholder='Street' style={fullInputStyle} />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
            <input name='city' value={formData.city} onChange={onChangeHandler} placeholder='City' style={inputStyle} />
            <input name='state' value={formData.state} onChange={onChangeHandler} placeholder='State' style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
            <input name='zipcode' value={formData.zipcode} onChange={onChangeHandler} placeholder='Zipcode' style={inputStyle} />
            <input name='country' value={formData.country} onChange={onChangeHandler} placeholder='Country' style={inputStyle} />
          </div>

          <input name='phone' value={formData.phone} onChange={onChangeHandler} placeholder='Phone' style={fullInputStyle} />

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
            onClick={onSubmitHandler}
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