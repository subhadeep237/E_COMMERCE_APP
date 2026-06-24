import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {

  const menuItems = [
    { path: '/add', label: 'Add Product', icon: '➕' },
    { path: '/list', label: 'Product List', icon: '📦' },
    { path: '/orders', label: 'Orders', icon: '🛒' }
  ]

  return (
    <div style={{
      width: '250px',
      minHeight: 'calc(100vh - 70px)',
      borderRight: '1px solid #e2e8f0',
      padding: '25px 15px',
      background: 'white'
    }}>

      <p style={{
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: '15px',
        paddingLeft: '12px',
        letterSpacing: '0.5px'
      }}>
        Main Menu
      </p>

      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            textDecoration: 'none',
            color: isActive ? 'white' : '#475569',
            background: isActive ? 'linear-gradient(135deg, #000 0%, #333 100%)' : 'transparent',
            marginBottom: '6px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: isActive ? '600' : '500',
            transition: '0.2s',
            border: isActive ? 'none' : '1px solid transparent'
          })}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains('active')) {
              e.currentTarget.style.background = '#f1f5f9'
            }
          }}
          onMouseLeave={(e) => {
            const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
            if (!isActive) {
              e.currentTarget.style.background = 'transparent'
            }
          }}
        >
          <span style={{ fontSize: '18px' }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '24px', marginBottom: '8px' }}>👨‍💼</p>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#831843', marginBottom: '4px' }}>
          Admin Dashboard
        </p>
        <p style={{ fontSize: '11px', color: '#9f1239' }}>
          Manage your store
        </p>
      </div>
    </div>
  )
}

export default Sidebar