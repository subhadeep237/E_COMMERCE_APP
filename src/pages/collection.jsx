import React from 'react'
import { Link } from 'react-router-dom'
import { products } from '../assets/assets/frontend_assets/assets'

const productNames = [
  'Off Shoulder Floral Top',
  'Oversized Polo T-shirt',
  'Floral Printed Dress',
  'Puma Logo Black T-shirt',
  'Puma Logo Black T-shirt',
  'Kids Pink Cotton Top',
  'Men Black Jeans',
  'Gap Striped Sweatshirt'
]

const Collection = () => {
  return (
    <div style={{ padding: '30px 6%' }}>

      <style>
        {`
          @media (max-width: 768px) {
            .collection-wrapper {
              flex-direction: column;
            }

            .filter-section {
              width: 100% !important;
            }

            .collection-header {
              flex-direction: column;
              gap: 20px;
            }

            .sort-box {
              position: static !important;
              width: 100%;
            }

            .product-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 20px !important;
            }

            .product-img {
              height: 230px !important;
            }

            .collection-title {
              font-size: 26px !important;
            }
          }

          @media (max-width: 480px) {
            .product-grid {
              grid-template-columns: repeat(1, 1fr) !important;
            }

            .product-img {
              height: 300px !important;
            }
          }
        `}
      </style>

      <div
        className='collection-wrapper'
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'flex-start'
        }}
      >

        {/* LEFT FILTER */}
        <div
          className='filter-section'
          style={{
            width: '230px',
            flexShrink: 0
          }}
        >

          <h2 style={{ fontSize: '22px', marginBottom: '25px' }}>FILTERS</h2>

          <div style={{
            border: '1px solid #ddd',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '15px' }}>CATEGORIES</p>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' /> Men
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' /> Women
            </label>

            <label style={{ display: 'block' }}>
              <input type='checkbox' /> Kids
            </label>
          </div>

          <div style={{
            border: '1px solid #ddd',
            padding: '20px'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '15px' }}>TYPE</p>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' /> Topwear
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' /> Bottomwear
            </label>

            <label style={{ display: 'block' }}>
              <input type='checkbox' /> Winterwear
            </label>
          </div>

        </div>

        {/* RIGHT PRODUCTS */}
        <div style={{ flex: 1, width: '100%' }}>

          <div
            className='collection-header'
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              marginBottom: '45px'
            }}
          >

            <div style={{ textAlign: 'center' }}>
              <h1
                className='collection-title'
                style={{
                  fontSize: '32px',
                  fontWeight: '500',
                  marginBottom: '10px'
                }}
              >
                ALL COLLECTIONS
              </h1>

              <div style={{
                width: '70px',
                height: '2px',
                background: 'black',
                margin: '0 auto'
              }}></div>
            </div>

            <select
              className='sort-box'
              style={{
                position: 'absolute',
                right: '0',
                top: '5px',
                padding: '12px 20px',
                border: '1px solid #ccc'
              }}
            >
              <option>Sort by: Relevant</option>
              <option>Sort by: Low to High</option>
              <option>Sort by: High to Low</option>
            </select>

          </div>

          <div
            className='product-grid'
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '35px'
            }}
          >

            {products.map((item, index) => (
              <Link
                to={`/product/${item._id}`}
                key={index}
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <div
                  onMouseEnter={(e) => {
                    e.currentTarget.children[0].style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.children[0].style.transform = 'scale(1)'
                  }}
                  style={{ overflow: 'hidden' }}
                >
                  <img
                    className='product-img'
                    src={item.image[0]}
                    alt=''
                    style={{
                      width: '100%',
                      height: '320px',
                      objectFit: 'cover',
                      transition: '0.3s ease-in-out'
                    }}
                  />

                  <p style={{
                    marginTop: '12px',
                    fontSize: '15px'
                  }}>
                    {productNames[index] || item.name}
                  </p>

                  <p style={{
                    fontWeight: 'bold',
                    marginTop: '8px'
                  }}>
                    ${item.price}
                  </p>
                </div>
              </Link>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Collection