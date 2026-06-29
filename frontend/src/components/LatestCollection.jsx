import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import StarRating from './StarRating'
import axios from 'axios'

const LatestCollection = () => {
  const { products, backendUrl } = useContext(ShopContext)
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/review/stats')
        if (response.data.success) {
          const ratingsMap = {}
          response.data.stats.forEach(stat => {
            ratingsMap[stat._id] = {
              average: Number(stat.averageRating.toFixed(1)),
              total: stat.totalReviews
            }
          })
          setRatings(ratingsMap)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (backendUrl) fetchRatings()
  }, [backendUrl])

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

        {products.slice(0, 10).map((item, index) => {
          const productRating = ratings[item._id]

          return (
            <Link
              to={`/product/${item._id}`}
              key={index}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <div
                onMouseEnter={(e)=>{e.currentTarget.children[0].style.transform='scale(1.05)'}}
                onMouseLeave={(e)=>{e.currentTarget.children[0].style.transform='scale(1)'}}
                style={{ overflow:'hidden' }}
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

                <p style={{ marginTop: '10px', fontSize: '14px' }}>
                  {item.name}
                </p>

                {/* Rating */}
                <div style={{ marginTop: '6px' }}>
                  <StarRating
                    rating={productRating ? productRating.average : 0}
                    totalReviews={productRating ? productRating.total : 0}
                    size={12}
                  />
                </div>

                <p style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '6px' }}>
                  ${item.price}
                </p>
              </div>
            </Link>
          )
        })}

      </div>
    </div>
  )
}

export default LatestCollection