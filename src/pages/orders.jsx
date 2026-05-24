import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Orders = () => {
  const { cartItems } = useContext(ShopContext)

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

      {cartItems.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        cartItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #ddd',
              padding: '20px 0',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img
                src={item.image[0]}
                alt=''
                style={{
                  width: '80px',
                  height: '100px',
                  objectFit: 'cover'
                }}
              />

              <div>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                  {item.name}
                </p>

                <p style={{ marginBottom: '8px' }}>
                  <b>${item.price}</b>
                  <span style={{ marginLeft: '15px' }}>Quantity: {item.quantity}</span>
                  <span style={{ marginLeft: '15px' }}>Size: {item.size}</span>
                </p>

                <p style={{ color: '#777' }}>
                  Date: 25, Jul, 2024
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                width: '9px',
                height: '9px',
                background: '#22c55e',
                borderRadius: '50%'
              }}></span>

              <p>Ready to ship</p>
            </div>

            <button style={{
              border: '1px solid #ddd',
              background: 'white',
              padding: '12px 25px',
              cursor: 'pointer'
            }}>
              Track Order
            </button>

          </div>
        ))
      )}

    </div>
  )
}

export default Orders