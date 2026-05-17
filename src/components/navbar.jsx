import React,{useState} from 'react'
import {assets} from '../assets/assets/admin_assets/assets'
import {assets as frontend_assets} from '../assets/assets/frontend_assets/assets'
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  const [visible,setVisible]=useState(false)
  return (
  <div style={{
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%'
  }}>

    <NavLink to='/'>
  <img src={assets.logo} className='w-36' alt='' />
</NavLink>

    <ul className='nav-menu'>

      <NavLink to='/'>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <p>HOME</p>
        <hr  style={{width:'50%',border:'1px solid black'}}/>
      </div>
      </NavLink>

      <NavLink to='/collection'>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <p>COLLECTION</p>
        <hr  style={{width:'50%',border:'1px solid black'}}/>
        </div>
      </NavLink>

      <NavLink to='/about'>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <p>ABOUT</p>
        <hr  style={{width:'50%',border:'1px solid black'}}/>
        </div>
      </NavLink>

      <NavLink to='/contact'>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        <p>CONTACT</p>
        <hr  style={{width:'50%',border:'1px solid black'}}/>
        </div>
      </NavLink>

    </ul>
    <div style={{display:'flex',gap:'20px',alignItems:'center',marginRight:'40px'}}>
      <img src={frontend_assets.search_icon} alt='' width='20px'/>
      <div
  style={{position:'relative'}}
  onMouseEnter={(e)=>{
    e.currentTarget.children[1].style.display='block'
  }}
  onMouseLeave={(e)=>{
    e.currentTarget.children[1].style.display='none'
  }}
>

  <img src={frontend_assets.profile_icon} alt='' width='20px' />

  <div
    style={{
      display:'none',
      position:'absolute',
      right:'0',
      top:'18px',
      background:'#f1f5f9',
      padding:'10px',
      borderRadius:'5px',
      width:'120px'
    }}
  >

    <p style={{cursor:'pointer'}} onMouseOver={(e)=>e.target.style.fontWeight='bold'} onMouseOut={(e)=>e.target.style.fontWeight='normal'}>
      My Profile
    </p>

    <p style={{cursor:'pointer'}} onMouseOver={(e)=>e.target.style.fontWeight='bold'} onMouseOut={(e)=>e.target.style.fontWeight='normal'}>
      Orders
    </p>

    <p style={{cursor:'pointer'}} onMouseOver={(e)=>e.target.style.fontWeight='bold'} onMouseOut={(e)=>e.target.style.fontWeight='normal'}>
      Log Out
    </p>

  </div>

</div>
<div style={{position:'relative'}}>

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
    1
  </p>

</div>
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
  padding:'20px'
}}>

  <p
  style={{
    cursor:'pointer',
    fontSize:'22px',
    marginBottom:'20px',
    fontWeight:'bold'
  }}
  onClick={()=>setVisible(false)}
>
  ← Back
</p>

  <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>

  <p>HOME</p>
  <hr />

  <p>COLLECTION</p>
  <hr />

  <p>ABOUT</p>
  <hr />

  <p>CONTACT</p>
  <hr />

</div>

</div>
  </div>
)
}

export default Navbar
