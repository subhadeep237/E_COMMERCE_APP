import React from 'react'
import { Link } from 'react-router-dom'
import { products } from '../assets/assets/frontend_assets/assets'

const LatestCollection = () => {
  return (
    <div style={{ marginTop: '60px' }}>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '30px', fontWeight: '400' }}>
          LATEST <b>COLLECTIONS</b> ─
        </h2>

        <p style={{ color: '#555', marginTop: '10px' }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '25px'
      }}>

        {products.slice(0, 10).map((item, index) => (
          <Link
            to={`/product/${item._id}`}
            key={index}
            style={{
              textDecoration: 'none',
              color: 'black'
            }}
          >

            <div
  onMouseEnter={(e)=>{
    e.currentTarget.children[0].style.transform='scale(1.05)'
  }}
  onMouseLeave={(e)=>{
    e.currentTarget.children[0].style.transform='scale(1)'
  }}
  style={{
    overflow:'hidden'
  }}
>
              <img
                src={item.image[0]}
                alt=''
                style={{
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  transition:'0.3s ease-in-out'
}}
              />

              <p style={{
                marginTop: '10px',
                fontSize: '14px'
              }}>
                {item.name}
              </p>

              <p style={{
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                ${item.price}
              </p>
            </div>

          </Link>
        ))}

      </div>

    </div>
  )
}

export default LatestCollection