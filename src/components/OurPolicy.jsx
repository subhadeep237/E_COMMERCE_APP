import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'

const Policy = () => {
  return (
    <div style={{
      display:'flex',
      justifyContent:'space-around',
      alignItems:'center',
      textAlign:'center',
      marginTop:'90px',
      marginBottom:'60px'
    }}>

      <div>
        <img src={assets.exchange_icon} alt='' style={{width:'45px', margin:'0 auto 15px'}} />
        <p style={{fontWeight:'600', fontSize:'16px'}}>Easy Exchange Policy</p>
        <p style={{color:'#777', fontSize:'14px'}}>We offer hassle free exchange policy</p>
      </div>

      <div>
        <img src={assets.quality_icon} alt='' style={{width:'45px', margin:'0 auto 15px'}} />
        <p style={{fontWeight:'600', fontSize:'16px'}}>7 Days Return Policy</p>
        <p style={{color:'#777', fontSize:'14px'}}>We provide 7 days free return policy</p>
      </div>

      <div>
        <img src={assets.support_img} alt='' style={{width:'45px', margin:'0 auto 15px'}} />
        <p style={{fontWeight:'600', fontSize:'16px'}}>Best customer support</p>
        <p style={{color:'#777', fontSize:'14px'}}>we provide 24/7 customer support</p>
      </div>

    </div>
  )
}

export default Policy