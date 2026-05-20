import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteFromCart } = useContext(ShopContext)

  return (
    <div style={{ padding: '40px 6%' }}>
      <h1 style={{ fontSize: '34px', marginBottom: '40px' }}>YOUR CART</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div
            key={`${item._id}-${item.size}-${index}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #ddd',
              padding: '20px 0',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img
                src={item.image[0]}
                alt=''
                style={{ width: '110px', height: '140px', objectFit: 'cover' }}
              />

              <div>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>{item.name}</p>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <p>${item.price}</p>

                  <button
                    style={{
                      border: '1px solid #ccc',
                      padding: '6px 14px',
                      background: '#f5f5f5'
                    }}
                  >
                    {item.size}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <button
                onClick={() => removeFromCart(item._id, item.size)}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ccc',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                -
              </button>

              <p>Qty: {item.quantity}</p>

              <button
                onClick={() => addToCart(item, item.size)}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #ccc',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                +
              </button>

              <button
                onClick={() => deleteFromCart(item._id, item.size)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '22px'
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Cart