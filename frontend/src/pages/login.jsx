import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login') // Login, Sign Up, OTP, Forgot, Reset
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const { token, setToken, backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (token && currentState !== 'OTP' && currentState !== 'Reset') {
      navigate('/')
    }
  }, [token])

  // Resend OTP countdown timer
  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // ============ SUBMIT HANDLER ============
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // ----- LOGIN -----
      if (currentState === 'Login') {
        if (!email || !password) {
          alert('Please fill all fields')
          setLoading(false)
          return
        }

        const response = await axios.post(backendUrl + '/api/user/login', {
          email,
          password
        })

        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          alert('Login successful!')
          navigate('/')
        } else {
          alert(response.data.message)
        }
      }

      // ----- SEND SIGNUP OTP -----
      else if (currentState === 'Sign Up') {
        if (!name || !email || !password) {
          alert('Please fill all fields')
          setLoading(false)
          return
        }

        if (password.length < 8) {
          alert('Password must be at least 8 characters')
          setLoading(false)
          return
        }

        const response = await axios.post(backendUrl + '/api/user/send-signup-otp', {
          name,
          email,
          password
        })

        if (response.data.success) {
          alert('OTP sent to your email!')
          setCurrentState('OTP')
          setResendTimer(60)
        } else {
          alert(response.data.message)
        }
      }

      // ----- VERIFY OTP & CREATE ACCOUNT -----
      else if (currentState === 'OTP') {
        if (!otp || otp.length !== 6) {
          alert('Please enter the 6-digit OTP')
          setLoading(false)
          return
        }

        const response = await axios.post(backendUrl + '/api/user/verify-signup-otp', {
          email,
          otp
        })

        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          alert('Account created successfully!')
          navigate('/')
        } else {
          alert(response.data.message)
        }
      }

      // ----- FORGOT PASSWORD - SEND OTP -----
      else if (currentState === 'Forgot') {
        if (!email) {
          alert('Please enter your email')
          setLoading(false)
          return
        }

        const response = await axios.post(backendUrl + '/api/user/forgot-password', {
          email
        })

        if (response.data.success) {
          alert('OTP sent to your email!')
          setCurrentState('Reset')
          setResendTimer(60)
        } else {
          alert(response.data.message)
        }
      }

      // ----- RESET PASSWORD -----
      else if (currentState === 'Reset') {
        if (!otp || otp.length !== 6) {
          alert('Please enter the 6-digit OTP')
          setLoading(false)
          return
        }

        if (!newPassword || newPassword.length < 8) {
          alert('New password must be at least 8 characters')
          setLoading(false)
          return
        }

        const response = await axios.post(backendUrl + '/api/user/reset-password', {
          email,
          otp,
          newPassword
        })

        if (response.data.success) {
          alert('Password reset successfully! Please login.')
          setCurrentState('Login')
          setOtp('')
          setNewPassword('')
          setPassword('')
        } else {
          alert(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ============ RESEND OTP ============
  const resendOTP = async () => {
    try {
      const purpose = currentState === 'OTP' ? 'signup' : 'reset-password'

      const response = await axios.post(backendUrl + '/api/user/resend-otp', {
        email,
        purpose
      })

      if (response.data.success) {
        alert('New OTP sent!')
        setResendTimer(60)
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  // ============ GET TITLE ============
  const getTitle = () => {
    switch (currentState) {
      case 'Login': return 'Login'
      case 'Sign Up': return 'Sign Up'
      case 'OTP': return 'Verify Email'
      case 'Forgot': return 'Forgot Password'
      case 'Reset': return 'Reset Password'
      default: return 'Login'
    }
  }

  // ============ GET BUTTON TEXT ============
  const getButtonText = () => {
    if (loading) return 'Please wait...'
    switch (currentState) {
      case 'Login': return 'SIGN IN'
      case 'Sign Up': return 'SEND OTP'
      case 'OTP': return 'VERIFY OTP'
      case 'Forgot': return 'SEND OTP'
      case 'Reset': return 'RESET PASSWORD'
      default: return 'SUBMIT'
    }
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

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '500', marginBottom: '8px' }}>
            {getTitle()}
          </h2>
          <div style={{ width: '50px', height: '2px', background: 'black', margin: '0 auto' }}></div>
        </div>

        {/* OTP Info */}
        {(currentState === 'OTP' || currentState === 'Reset') && (
          <div style={{
            background: '#fce7f3',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '13px', color: '#831843' }}>
              📧 OTP sent to <b>{email}</b>
            </p>
          </div>
        )}

        {/* Name - only for Sign Up */}
        {currentState === 'Sign Up' && (
          <input
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        )}

        {/* Email - for Login, Sign Up, Forgot */}
        {(currentState === 'Login' || currentState === 'Sign Up' || currentState === 'Forgot') && (
          <input
            type='email'
            placeholder='Email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        )}

        {/* Password - for Login, Sign Up */}
        {(currentState === 'Login' || currentState === 'Sign Up') && (
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        )}

        {/* OTP Input - for OTP, Reset */}
        {(currentState === 'OTP' || currentState === 'Reset') && (
          <input
            type='text'
            placeholder='Enter 6-digit OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            style={{ ...inputStyle, textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }}
          />
        )}

        {/* New Password - for Reset */}
        {currentState === 'Reset' && (
          <input
            type='password'
            placeholder='New Password (min 8 chars)'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          />
        )}

        {/* Bottom links */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          marginBottom: '25px'
        }}>

          {currentState === 'Login' && (
            <>
              <p
                onClick={() => setCurrentState('Forgot')}
                style={{ cursor: 'pointer', color: '#555' }}
              >
                Forgot your password?
              </p>
              <p
                onClick={() => setCurrentState('Sign Up')}
                style={{ cursor: 'pointer', color: '#111', fontWeight: '600' }}
              >
                Create account
              </p>
            </>
          )}

          {currentState === 'Sign Up' && (
            <p
              onClick={() => setCurrentState('Login')}
              style={{ cursor: 'pointer', color: '#111', fontWeight: '600', marginLeft: 'auto' }}
            >
              Login here
            </p>
          )}

          {(currentState === 'OTP' || currentState === 'Reset') && (
            <>
              {resendTimer > 0 ? (
                <p style={{ color: '#777' }}>
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <p
                  onClick={resendOTP}
                  style={{ cursor: 'pointer', color: '#0f172a', fontWeight: '600' }}
                >
                  Resend OTP
                </p>
              )}
              <p
                onClick={() => {
                  setCurrentState('Login')
                  setOtp('')
                }}
                style={{ cursor: 'pointer', color: '#555' }}
              >
                Cancel
              </p>
            </>
          )}

          {currentState === 'Forgot' && (
            <p
              onClick={() => setCurrentState('Login')}
              style={{ cursor: 'pointer', color: '#111', fontWeight: '600', marginLeft: 'auto' }}
            >
              Back to Login
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#666' : 'black',
            color: 'white',
            border: 'none',
            padding: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            letterSpacing: '1px'
          }}
        >
          {getButtonText()}
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