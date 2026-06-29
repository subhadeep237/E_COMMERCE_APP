import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/user/admin', {
        email,
        password
      })

      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setToken(response.data.token)
        toast.success('Login successful!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)'
    }}>

      <form
        onSubmit={onSubmitHandler}
        style={{
          width: '400px',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}
      >

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #000 0%, #333 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '28px',
            margin: '0 auto 15px'
          }}>
            F
          </div>

          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '5px'
          }}>
            Admin Login
          </h2>

          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Sign in to access dashboard
          </p>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>Password</label>
          <input
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#666' : 'linear-gradient(135deg, #000 0%, #333 100%)',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            transition: '0.2s'
          }}
        >
          {loading ? 'Signing in...' : 'SIGN IN'}
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          🔒 Secure admin access only
        </p>
      </form>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: '500',
  color: '#475569'
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  transition: '0.2s',
  background: '#f8fafc',
  color: '#1e293b'
}

export default Login