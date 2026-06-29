import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div style={{ padding: '40px 6%' }}>

      <style>
        {`
          .explore-btn:hover{
            background: black !important;
            color: white !important;
          }

          @media(max-width:768px){
            .contact-main{
              flex-direction: column;
            }

            .contact-img{
              width: 100% !important;
            }

            .contact-info{
              width: 100% !important;
            }
          }
        `}
      </style>

      <div style={{
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <h1 style={{
          fontSize: '30px',
          fontWeight: '400'
        }}>
          CONTACT <b>US</b> ─
        </h1>
      </div>

      <div
        className='contact-main'
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '60px',
          marginBottom: '100px'
        }}
      >

        <img
          className='contact-img'
          src={assets.contact_img}
          alt=''
          style={{
            width: '42%',
            objectFit: 'cover'
          }}
        />

        <div
          className='contact-info'
          style={{
            width: '35%',
            color: '#555',
            lineHeight: '28px'
          }}
        >

          <h2 style={{
            fontSize: '22px',
            color: '#333',
            marginBottom: '25px'
          }}>
            Our Store
          </h2>

          <p>54709 Willms Station</p>
          <p style={{ marginBottom: '25px' }}>
            Suite 350, Washington, USA
          </p>

          <p>Tel: (415) 555-0132</p>
          <p style={{ marginBottom: '30px' }}>
            Email: admin@forever.com
          </p>

          <h2 style={{
            fontSize: '22px',
            color: '#333',
            marginBottom: '25px'
          }}>
            Careers at Forever
          </h2>

          <p style={{ marginBottom: '25px' }}>
            Learn more about our teams and job openings.
          </p>

          <button
            className='explore-btn'
            style={{
              padding: '16px 35px',
              background: 'white',
              border: '1px solid #555',
              cursor: 'pointer',
              transition: '0.3s ease-in-out'
            }}
          >
            Explore Jobs
          </button>

        </div>

      </div>

      <NewsLetterBox />

    </div>
  )
}

export default Contact