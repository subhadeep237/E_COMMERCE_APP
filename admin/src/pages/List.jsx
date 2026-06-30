import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({ token, backendUrl }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list?all=true')

      if (response.data.success) {
        setProducts(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id }
      )

      if (response.data.success) {
        toast.success('Product deleted successfully!')
        await fetchProducts()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '5px'
          }}>
            All Products
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Total: <b>{products.length}</b> products in store
          </p>
        </div>

        <input
          type='text'
          placeholder='🔍 Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '14px',
            width: '280px',
            background: 'white'
          }}
        />
      </div>

      {loading ? (
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          No products found
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 2fr 1fr 1fr 0.8fr 100px',
            gap: '15px',
            padding: '12px 15px',
            background: '#f8fafc',
            borderRadius: '8px',
            marginBottom: '10px',
            fontWeight: '600',
            fontSize: '13px',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <p>Image</p>
            <p>Name</p>
            <p>Category</p>
            <p>Sub Category</p>
            <p>Price</p>
            <p style={{ textAlign: 'center' }}>Action</p>
          </div>

          {/* Products List */}
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 1fr 1fr 0.8fr 100px',
                gap: '15px',
                padding: '15px',
                borderBottom: index < filteredProducts.length - 1 ? '1px solid #f1f5f9' : 'none',
                alignItems: 'center',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <img
                src={product.image[0]}
                alt=''
                style={{
                  width: '60px',
                  height: '70px',
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />

              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                  {product.name}
                </p>
                {product.bestseller && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 8px',
                    background: '#fce7f3',
                    color: '#831843',
                    fontSize: '10px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>
                    ⭐ BESTSELLER
                  </span>
                )}
              </div>

              <p style={{ fontSize: '14px', color: '#475569' }}>{product.category}</p>
              <p style={{ fontSize: '14px', color: '#475569' }}>{product.subCategory}</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                ${product.price}
              </p>

              <button
                onClick={() => removeProduct(product._id)}
                style={{
                  padding: '8px 14px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: '0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#dc2626'
                  e.target.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#fee2e2'
                  e.target.style.color = '#dc2626'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default List