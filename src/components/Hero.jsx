import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'

const Hero = () => {
  return (
    <div style={{
      display:'flex',
      border:'1px solid #9ca3af',
      marginTop:'20px'
    }}>

      {/* Left Side */}
      <div style={{
        width:'50%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'80px 20px'
      }}>

        <div style={{color:'#414141'}}>

          <div style={{
            display:'flex',
            alignItems:'center',
            gap:'10px'
          }}>
            <p style={{
              width:'45px',
              height:'2px',
              background:'#414141'
            }}></p>

            <p style={{
              fontWeight:'500',
              fontSize:'16px'
            }}>
              OUR BESTSELLERS
            </p>
          </div>

          <h1 style={{
            fontSize:'48px',
            fontWeight:'400',
            margin:'20px 0'
          }}>
            Latest Arrivals
          </h1>

          <div style={{
            display:'flex',
            alignItems:'center',
            gap:'10px'
          }}>
            <p style={{
              fontWeight:'600',
              fontSize:'16px'
            }}>
              SHOP NOW
            </p>

            <p style={{
              width:'45px',
              height:'1px',
              background:'#414141'
            }}></p>
          </div>

        </div>
      </div>

      {/* Right Side Image */}
      <img
        src={assets.hero_img}
        alt=''
        style={{
          width:'50%',
          height:'450px',
          objectFit:'cover'
        }}
      />

    </div>
  )
}

export default Hero