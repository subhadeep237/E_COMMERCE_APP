import React, { useContext, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { assets } from '../assets/assets/admin_assets/assets'
import { assets as frontend_assets } from '../assets/assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const { cartCount } = useContext(ShopContext)

  return (
    <div style={{
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      width:'100%',
      padding:'20px 6%'
    }}>

      <Link to='/'>
        <img src={assets.logo} alt='' style={{width:'140px'}} />
      </Link>

      <ul className='nav-menu'>
        <NavLink to='/'><p>HOME</p><hr /></NavLink>
        <NavLink to='/collection'><p>COLLECTION</p><hr /></NavLink>
        <NavLink to='/about'><p>ABOUT</p><hr /></NavLink>
        <NavLink to='/contact'><p>CONTACT</p><hr /></NavLink>
      </ul>

      <div style={{display:'flex', gap:'20px', alignItems:'center', marginRight:'40px'}}>

        <img
          src={frontend_assets.search_icon}
          alt=''
          width='20px'
          style={{cursor:'pointer'}}
          onClick={()=>{
            if(window.location.pathname === '/collection'){
              window.dispatchEvent(new Event('openSearchBar'))
            }
          }}
        />

        <div
          style={{position:'relative'}}
          onMouseEnter={(e)=>e.currentTarget.children[1].style.display='block'}
          onMouseLeave={(e)=>e.currentTarget.children[1].style.display='none'}
        >
          <img src={frontend_assets.profile_icon} alt='' width='20px' />

          <div style={{
            display:'none',
            position:'absolute',
            right:'0',
            top:'18px',
            background:'#f1f5f9',
            padding:'10px',
            borderRadius:'5px',
            width:'120px',
            zIndex:10
          }}>
            <p style={{cursor:'pointer'}}>My Profile</p>
            <p style={{cursor:'pointer'}}>Orders</p>
            <p style={{cursor:'pointer'}}>Log Out</p>
          </div>
        </div>

        <Link to='/cart' style={{position:'relative'}}>
          <img src={frontend_assets.cart_icon} alt='' width='20px' />

          <p style={{
            position:'absolute',
            top:'-8px',
            right:'-8px',
            background:'black',
            color:'white',
            borderRadius:'50%',
            width:'18px',
            height:'18px',
            fontSize:'12px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
          }}>
            {cartCount}
          </p>
        </Link>

        <img
          className='menu-icon'
          src={frontend_assets.menu_icon}
          alt=''
          width='20px'
          onClick={()=>setVisible(true)}
        />
      </div>

      <div style={{
        position:'fixed',
        top:'0',
        right: visible ? '0' : '-250px',
        width:'250px',
        height:'100%',
        background:'white',
        transition:'0.5s',
        padding:'20px',
        zIndex:20
      }}>
        <p
          style={{cursor:'pointer', fontSize:'22px', marginBottom:'20px', fontWeight:'bold'}}
          onClick={()=>setVisible(false)}
        >
          ← Back
        </p>

        <div className='sidebar-links'>
          <NavLink onClick={()=>setVisible(false)} to='/'>HOME</NavLink>
          <hr />
          <NavLink onClick={()=>setVisible(false)} to='/collection'>COLLECTION</NavLink>
          <hr />
          <NavLink onClick={()=>setVisible(false)} to='/about'>ABOUT</NavLink>
          <hr />
          <NavLink onClick={()=>setVisible(false)} to='/contact'>CONTACT</NavLink>
          <hr />
        </div>
      </div>

    </div>
  )
}

export default Navbar