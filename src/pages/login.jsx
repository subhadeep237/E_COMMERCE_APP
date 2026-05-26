import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onSubmitHandler = (e) => {
    e.preventDefault()

    if (currentState === 'Sign Up' && name.trim() === '') {
      alert('Please enter your name')
      return
    }

    if (email.trim() === '') {
      alert('Please enter your email')
      return
    }

    if (password.trim() === '') {
      alert('Please enter your password')
      return
    }

    if (currentState === 'Login') {
      alert('Login successful')
    } else {
      alert('Account created successfully')
    }

    navigate('/')
  }

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 6%'
    }}>

      <form
        onSubmit={onSubmitHandler}
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '35px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
          background: 'white'
        }}
      >

        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            {currentState}
          </h2>

          <div style={{
            width: '50px',
            height: '2px',
            background: 'black',
            margin: '0 auto'
          }}></div>
        </div>

        {currentState === 'Sign Up' && (
          <input
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          type='email'
          placeholder='Email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          marginBottom: '25px'
        }}>

          <p style={{ cursor: 'pointer', color: '#555' }}>
            Forgot your password?
          </p>

          {currentState === 'Login' ? (
            <p
              onClick={() => setCurrentState('Sign Up')}
              style={{ cursor: 'pointer', color: '#111', fontWeight: '600' }}
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState('Login')}
              style={{ cursor: 'pointer', color: '#111', fontWeight: '600' }}
            >
              Login here
            </p>
          )}

        </div>

        <button
          type='submit'
          style={{
            width: '100%',
            background: 'black',
            color: 'white',
            border: 'none',
            padding: '14px',
            cursor: 'pointer',
            fontSize: '15px',
            letterSpacing: '1px'
          }}
        >
          {currentState === 'Login' ? 'SIGN IN' : 'SIGN UP'}
        </button>

      </form>

    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '16px',
  border: '1px solid #ccc',
  outline: 'none',
  fontSize: '15px'
}

export default Login