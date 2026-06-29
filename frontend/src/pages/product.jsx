import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import StarRating from '../components/StarRating'
import axios from 'axios'

const Product = () => {

  const { productId } = useParams()
  const { products, addToCart, token, backendUrl } = useContext(ShopContext)

  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [newRating, setNewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // Get user ID from token (for delete check)
  const getUserIdFromToken = () => {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.id
    } catch {
      return null
    }
  }
  const currentUserId = getUserIdFromToken()

  useEffect(() => {
    const product = products.find((item) => item._id === productId)
    if (product) {
      setProductData(product)
      setImage(product.image[0])
    }
  }, [productId, products])

  // Fetch reviews for this product
  const fetchReviews = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/review/product/' + productId)
      if (response.data.success) {
        setReviews(response.data.reviews)
        setAverageRating(response.data.averageRating)
        setTotalReviews(response.data.totalReviews)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (productId) fetchReviews()
  }, [productId])

  // Submit new review
  const submitReview = async () => {
    if (!token) {
      alert('Please login to write a review')
      return
    }

    if (newRating === 0) {
      alert('Please select a rating')
      return
    }

    if (newComment.trim() === '') {
      alert('Please write a comment')
      return
    }

    try {
      setSubmittingReview(true)
      const response = await axios.post(
        backendUrl + '/api/review/add',
        {
          productId,
          rating: newRating,
          comment: newComment
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        alert('Review submitted!')
        setNewRating(0)
        setNewComment('')
        await fetchReviews()
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
    } finally {
      setSubmittingReview(false)
    }
  }

  // Delete review
  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await axios.delete(
        backendUrl + '/api/review/' + reviewId,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        alert('Review deleted!')
        await fetchReviews()
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  if (!productData) {
    return <div>Loading...</div>
  }

  return (
    <div style={{padding:'40px 6%'}}>

      <div style={{display:'flex', gap:'50px', flexWrap:'wrap'}}>

        {/* LEFT */}
        <div style={{display:'flex', gap:'15px', flex:'1'}}>

          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {productData.image.map((item,index)=>(
              <img
                key={index}
                src={item}
                alt=''
                onClick={()=>setImage(item)}
                style={{
                  width:'90px',
                  cursor:'pointer',
                  border:image===item ? '2px solid black' : '1px solid #ddd'
                }}
              />
            ))}
          </div>

          <div>
            <img src={image} alt='' style={{width:'500px', maxWidth:'100%', objectFit:'cover'}} />
          </div>

        </div>

        {/* RIGHT */}
        <div style={{flex:'1'}}>

          <h1 style={{fontSize:'32px', marginBottom:'15px'}}>
            {productData.name}
          </h1>

          {/* REAL RATING */}
          <div style={{marginBottom:'20px'}}>
            <StarRating rating={averageRating} totalReviews={totalReviews} size={18} />
          </div>

          <h2 style={{fontSize:'34px', marginBottom:'20px'}}>
            ${productData.price}
          </h2>

          <p style={{color:'#555', lineHeight:'28px', marginBottom:'30px'}}>
            {productData.description}
          </p>

          <p style={{marginBottom:'15px'}}>Select Size</p>

          <div style={{display:'flex', gap:'12px', marginBottom:'30px'}}>
            {productData.sizes.map((item,index)=>(
              <button
                key={index}
                onClick={()=>setSize(item)}
                style={{
                  padding:'12px 18px',
                  border:size===item ? '2px solid orange' : '1px solid #ddd',
                  background:'#f5f5f5',
                  cursor:'pointer'
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={()=>{
              if(size==='') window.alert('Please select a size')
              else addToCart(productData, size)
            }}
            style={{
              background:'black',
              color:'white',
              border:'none',
              padding:'16px 40px',
              cursor:'pointer',
              marginBottom:'35px'
            }}
          >
            ADD TO CART
          </button>

          <hr style={{marginBottom:'25px'}} />

          <div style={{color:'#555', lineHeight:'28px'}}>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>

        </div>
      </div>

      {/* DESCRIPTION + REVIEW TABS */}
      <div style={{marginTop:'80px', border:'1px solid #ddd'}}>

        <div style={{display:'flex'}}>
          <button
            onClick={()=>setActiveTab('description')}
            style={{
              padding:'16px 28px',
              border:'none',
              borderRight:'1px solid #ddd',
              background:activeTab==='description' ? '#f5f5f5' : 'white',
              cursor:'pointer',
              fontWeight:'600'
            }}
          >
            Description
          </button>

          <button
            onClick={()=>setActiveTab('reviews')}
            style={{
              padding:'16px 28px',
              border:'none',
              background:activeTab==='reviews' ? '#f5f5f5' : 'white',
              cursor:'pointer',
              fontWeight:'600'
            }}
          >
            Reviews ({totalReviews})
          </button>
        </div>

        <div style={{padding:'30px', color:'#555', lineHeight:'28px'}}>

          {activeTab==='description' ? (
            <>
              <p>An e-commerce website is an online platform that facilitates buying and selling products online.</p>
              <p style={{marginTop:'20px'}}>Products are displayed with descriptions, prices, images and detailed information.</p>
            </>
          ) : (
            <div>

              {/* WRITE REVIEW FORM */}
              <div style={{
                marginBottom: '40px',
                padding: '25px',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '15px'
                }}>
                  ✍️ Write a Review
                </h3>

                {/* Star Rating Input */}
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ color: '#555', marginBottom: '8px', fontSize: '14px' }}>Your Rating:</p>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          fontSize: '32px',
                          cursor: 'pointer',
                          color: star <= (hoverRating || newRating) ? '#fbbf24' : '#d1d5db',
                          transition: '0.2s'
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{
                      marginLeft: '10px',
                      color: '#555',
                      alignSelf: 'center',
                      fontSize: '14px'
                    }}>
                      {newRating > 0 ? `${newRating}/5` : 'Click a star'}
                    </span>
                  </div>
                </div>

                {/* Comment Input */}
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder='Share your experience with this product...'
                  rows='4'
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '14px',
                    marginBottom: '15px',
                    color: '#1f2937'
                  }}
                />

                <button
                  onClick={submitReview}
                  disabled={submittingReview}
                  style={{
                    background: submittingReview ? '#666' : 'black',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    cursor: submittingReview ? 'not-allowed' : 'pointer',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

              {/* REVIEWS LIST */}
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '20px'
              }}>
                Customer Reviews ({totalReviews})
              </h3>

              {reviews.length === 0 ? (
                <p style={{ color: '#777' }}>
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      style={{
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: 'white'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '10px'
                      }}>
                        <div>
                          <p style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '5px'
                          }}>
                            {review.userName}
                          </p>
                          <StarRating rating={review.rating} showCount={false} size={14} />
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '13px' }}>
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <p style={{ color: '#374151', lineHeight: '22px', marginTop: '10px' }}>
                        {review.comment}
                      </p>

                      {/* Show delete button if user owns this review */}
                      {currentUserId && String(review.userId) === String(currentUserId) && (
                        <button
                          onClick={() => deleteReview(review._id)}
                          style={{
                            marginTop: '10px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            padding: '6px 14px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          Delete My Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div style={{marginTop:'90px'}}>
        <div style={{textAlign:'center', marginBottom:'40px'}}>
          <h2 style={{fontSize:'32px', fontWeight:'400'}}>
            RELATED <b>PRODUCTS</b> ─
          </h2>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
          gap:'25px'
        }}>
          {products
            .filter((item)=>item.category===productData.category)
            .slice(0,5)
            .map((item,index)=>(
              <Link
                key={index}
                to={`/product/${item._id}`}
                style={{textDecoration:'none', color:'black'}}
              >
                <div
                  onMouseEnter={(e)=>{e.currentTarget.children[0].style.transform='scale(1.05)'}}
                  onMouseLeave={(e)=>{e.currentTarget.children[0].style.transform='scale(1)'}}
                  style={{overflow:'hidden'}}
                >
                  <img
                    src={item.image[0]}
                    alt=''
                    style={{
                      width:'100%',
                      height:'300px',
                      objectFit:'cover',
                      transition:'0.3s ease-in-out'
                    }}
                  />
                  <p style={{marginTop:'12px'}}>{item.name}</p>
                  <p style={{fontWeight:'600'}}>${item.price}</p>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Product