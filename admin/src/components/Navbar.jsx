import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ setToken }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/')
  }

  return (
    <div style={{
      height: '70px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 40px',
      borderBottom: '1px solid #e2e8f0',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #000 0%, #333 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          F
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
            FOREVER
          </h1>
          <p style={{ fontSize: '11px', color: '#ec4899', margin: 0, fontWeight: '500' }}>
            ADMIN PANEL
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: '#f1f5f9',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            A
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
            Admin
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'black',
            color: 'white',
            border: 'none',
            padding: '10px 22px',
            cursor: 'pointer',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: '0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#333'}
          onMouseLeave={(e) => e.target.style.background = 'black'}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar