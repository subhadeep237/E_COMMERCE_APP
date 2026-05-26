import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div style={{ padding: '40px 6%' }}>

      <style>
        {`
          @media(max-width:768px){
            .about-main{
              flex-direction: column;
            }

            .about-img{
              width: 100% !important;
            }

            .about-text{
              width: 100% !important;
            }

            .choose-box{
              grid-template-columns: 1fr !important;
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
          ABOUT <b>US</b> ─
        </h1>
      </div>

      <div
        className='about-main'
        style={{
          display: 'flex',
          gap: '60px',
          alignItems: 'center',
          marginBottom: '80px'
        }}
      >

        <img
          className='about-img'
          src={assets.about_img}
          alt=''
          style={{
            width: '40%',
            objectFit: 'cover'
          }}
        />

        <div
          className='about-text'
          style={{
            width: '55%',
            color: '#555',
            lineHeight: '28px'
          }}
        >
          <p>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>

          <p style={{ marginTop: '25px' }}>
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>

          <h3 style={{
            marginTop: '30px',
            marginBottom: '15px',
            color: 'black'
          }}>
            Our Mission
          </h3>

          <p>
            Our mission at Forever is to empower customers with choice,
            convenience, and confidence. We're dedicated to providing a seamless
            shopping experience that exceeds expectations, from browsing and
            ordering to delivery and beyond.
          </p>
        </div>

      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '35px'
      }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '400'
        }}>
          WHY <b>CHOOSE US</b>
        </h2>

        <div style={{
          width: '60px',
          height: '2px',
          background: 'black'
        }}></div>
      </div>

      <div
        className='choose-box'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          border: '1px solid #ddd',
          marginBottom: '80px'
        }}
      >

        <div style={boxStyle}>
          <h3 style={headingStyle}>Quality Assurance:</h3>
          <p style={paraStyle}>
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </div>

        <div style={boxStyle}>
          <h3 style={headingStyle}>Convenience:</h3>
          <p style={paraStyle}>
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </div>

        <div style={boxStyle}>
          <h3 style={headingStyle}>Exceptional Customer Service:</h3>
          <p style={paraStyle}>
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </div>

      </div>

      <NewsLetterBox />

    </div>
  )
}

const boxStyle = {
  padding: '55px 45px',
  borderRight: '1px solid #ddd',
  minHeight: '180px'
}

const headingStyle = {
  fontSize: '16px',
  marginBottom: '20px',
  color: 'black'
}

const paraStyle = {
  color: '#555',
  lineHeight: '26px'
}

export default About