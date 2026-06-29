import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import StarRating from '../components/StarRating'
import axios from 'axios'

const Collection = () => {
  const { products, backendUrl } = useContext(ShopContext)

  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState('')
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    const openSearch = () => {
      setShowSearch(true)
    }

    window.addEventListener('openSearchBar', openSearch)

    return () => {
      window.removeEventListener('openSearchBar', openSearch)
    }
  }, [])

  // Fetch all ratings
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

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  let filteredProducts = products.filter((item) => {
    const categoryMatch =
      category.length === 0 || category.includes(item.category)

    const subCategoryMatch =
      subCategory.length === 0 || subCategory.includes(item.subCategory)

    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase())

    return categoryMatch && subCategoryMatch && searchMatch
  })

  if (sortType === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price)
  }

  if (sortType === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price)
  }

  return (
    <div style={{ padding: '30px 6%' }}>

      {showSearch && (
        <div style={{
          background:'#f8f8f8',
          padding:'20px',
          marginBottom:'40px',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          gap:'15px'
        }}>
          <input
            type='text'
            placeholder='Search'
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            style={{
              width:'50%',
              padding:'12px 20px',
              borderRadius:'25px',
              border:'1px solid #aaa',
              outline:'none',
              fontSize:'16px'
            }}
          />
          <span style={{fontSize:'22px'}}>🔍</span>
          <button
            onClick={()=>{
              setShowSearch(false)
              setSearch('')
            }}
            style={{
              border:'none',
              background:'transparent',
              fontSize:'28px',
              cursor:'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}

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

      <div className='collection-wrapper' style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>

        <div className='filter-section' style={{ width: '230px', flexShrink: 0 }}>

          <h2 style={{ fontSize: '22px', marginBottom: '25px' }}>FILTERS</h2>

          <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '25px' }}>
            <p style={{ fontWeight: '600', marginBottom: '15px' }}>CATEGORIES</p>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' value='Men' onChange={toggleCategory} /> Men
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' value='Women' onChange={toggleCategory} /> Women
            </label>

            <label style={{ display: 'block' }}>
              <input type='checkbox' value='Kids' onChange={toggleCategory} /> Kids
            </label>
          </div>

          <div style={{ border: '1px solid #ddd', padding: '20px' }}>
            <p style={{ fontWeight: '600', marginBottom: '15px' }}>TYPE</p>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' value='Topwear' onChange={toggleSubCategory} /> Topwear
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
              <input type='checkbox' value='Bottomwear' onChange={toggleSubCategory} /> Bottomwear
            </label>

            <label style={{ display: 'block' }}>
              <input type='checkbox' value='Winterwear' onChange={toggleSubCategory} /> Winterwear
            </label>
          </div>

        </div>

        <div style={{ flex: 1, width: '100%' }}>

          <div className='collection-header' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            marginBottom: '45px'
          }}>

            <div style={{ textAlign: 'center' }}>
              <h1 className='collection-title' style={{ fontSize: '32px', fontWeight: '500', marginBottom: '10px' }}>
                ALL COLLECTIONS
              </h1>

              <div style={{ width: '70px', height: '2px', background: 'black', margin: '0 auto' }}></div>
            </div>

            <select
              className='sort-box'
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{
                position: 'absolute',
                right: '0',
                top: '5px',
                padding: '12px 20px',
                border: '1px solid #ccc'
              }}
            >
              <option value='relevant'>Sort by: Relevant</option>
              <option value='low-high'>Sort by: Low to High</option>
              <option value='high-low'>Sort by: High to Low</option>
            </select>

          </div>

          <div className='product-grid' style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '35px'
          }}>

            {filteredProducts.map((item, index) => {
              const productRating = ratings[item._id]

              return (
                <Link
                  to={`/product/${item._id}`}
                  key={index}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <div
                    onMouseEnter={(e) => {e.currentTarget.children[0].style.transform = 'scale(1.05)'}}
                    onMouseLeave={(e) => {e.currentTarget.children[0].style.transform = 'scale(1)'}}
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

                    <p style={{ marginTop: '12px', fontSize: '15px' }}>
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

                    <p style={{ fontWeight: 'bold', marginTop: '8px' }}>
                      ${item.price}
                    </p>
                  </div>
                </Link>
              )
            })}

          </div>
        </div>

      </div>
    </div>
  )
}

export default Collection