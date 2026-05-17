import React from 'react'
import { assets } from '../assets/assets/admin_assets/assets'

const Footer = () => {
  return (
    <div style={{
  marginTop:'100px',
  borderTop:'1px solid #d1d5db',
  paddingTop:'40px'
}}>

      <div style={{
        display:'flex',
        justifyContent:'space-between',
        gap:'40px',
        marginBottom:'40px'
      }}>

        {/* Left Side */}
        <div style={{width:'40%'}}>

          <img
            src={assets.logo}
            alt=''
            style={{width:'140px'}}
          />

          <p style={{
            color:'#777',
            marginTop:'20px',
            lineHeight:'28px'
          }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book.
          </p>

        </div>

        {/* Middle */}
        <div>

          <p style={{
            fontSize:'24px',
            fontWeight:'600',
            marginBottom:'20px'
          }}>
            COMPANY
          </p>

          <div style={{
            display:'flex',
            flexDirection:'column',
            gap:'10px',
            color:'#777'
          }}>
            <p>Home</p>
            <p>About us</p>
            <p>Delivery</p>
            <p>Privacy policy</p>
          </div>

        </div>

        {/* Right */}
        <div>

          <p style={{
            fontSize:'24px',
            fontWeight:'600',
            marginBottom:'20px'
          }}>
            GET IN TOUCH
          </p>

          <div style={{
            display:'flex',
            flexDirection:'column',
            gap:'10px',
            color:'#777'
          }}>
            <p>+1-212-456-7890</p>
            <p>contact@foreveryou.com</p>
          </div>

        </div>

      </div>


      <p style={{
        textAlign:'center',
        marginTop:'20px',
        marginBottom:'20px',
        color:'#777'
      }}>
        Copyright 2024@ forever.com - All Right Reserved.
      </p>

    </div>
  )
}

export default Footer