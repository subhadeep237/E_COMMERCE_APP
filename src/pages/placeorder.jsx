import React from 'react'

const Placeorder = () => {
  return (
    <div style={{ padding: '40px 6%' }}>
      <h1 style={{ fontSize: '34px', marginBottom: '30px' }}>PLACE ORDER</h1>

      <div style={{ maxWidth: '600px' }}>
        <input placeholder='Full Name' style={inputStyle} />
        <input placeholder='Email Address' style={inputStyle} />
        <input placeholder='Phone Number' style={inputStyle} />
        <input placeholder='Address' style={inputStyle} />
        <input placeholder='City' style={inputStyle} />
        <input placeholder='Pincode' style={inputStyle} />

        <button style={{
          background: 'black',
          color: 'white',
          border: 'none',
          padding: '14px 35px',
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          PLACE ORDER
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  outline: 'none'
}

export default Placeorder