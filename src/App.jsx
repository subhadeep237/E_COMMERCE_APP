import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/home'
import Collection from './pages/collection'
import About from './pages/about'
import Contact from './pages/contact'
import Product from './pages/product'
import Cart from './pages/cart'
import Login from './pages/login'
import Placeorder from './pages/placeorder'
import Orders from './pages/orders'
import Footer from './components/Footer'
import Navbar from './components/navbar'


const App=() => {
  return(
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
          <Routes>
            <Route  path='/' element={<Home/>} />
            <Route path='/collection' element={<Collection/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/contact' element={<Contact/>} />
            <Route path='/product/:productId' element={<Product/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/place-order' element={<Placeorder/>} />
            <Route path='/orders' element={<Orders/>} />
          </Routes>
          <Footer/>
    </div>
  )
}

export default App