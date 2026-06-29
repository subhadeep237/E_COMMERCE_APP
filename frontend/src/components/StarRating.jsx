import React from 'react'

const StarRating = ({ rating, totalReviews, size = 14, showCount = true }) => {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      // Full star
      stars.push(
        <span key={i} style={{ color: '#fbbf24', fontSize: size }}>★</span>
      )
    } else if (i - 0.5 <= rating) {
      // Half star (we'll show full for simplicity)
      stars.push(
        <span key={i} style={{ color: '#fbbf24', fontSize: size }}>★</span>
      )
    } else {
      // Empty star
      stars.push(
        <span key={i} style={{ color: '#d1d5db', fontSize: size }}>★</span>
      )
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }}>
      <div style={{ display: 'flex' }}>
        {stars}
      </div>
      {showCount && (
        <span style={{
          fontSize: size - 2,
          color: '#666',
          marginLeft: '4px'
        }}>
          {rating > 0 ? `(${totalReviews || 0})` : 'No reviews yet'}
        </span>
      )}
    </div>
  )
}

export default StarRating