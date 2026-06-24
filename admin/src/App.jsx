import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Backend API base url
export const backendUrl = "http://localhost:4000"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <ToastContainer position='top-right' autoClose={2000} />

      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ width: '100%', padding: '30px', background: '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
              <Routes>
                <Route path='/' element={<Add token={token} backendUrl={backendUrl} />} />
                <Route path='/add' element={<Add token={token} backendUrl={backendUrl} />} />
                <Route path='/list' element={<List token={token} backendUrl={backendUrl} />} />
                <Route path='/orders' element={<Orders token={token} backendUrl={backendUrl} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App