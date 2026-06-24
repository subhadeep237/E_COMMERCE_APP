import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ token, backendUrl }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const [loading, setLoading] = useState(false)

  const toggleSize = (size) => {
    if (sizes.includes(size)) {
      setSizes(prev => prev.filter(s => s !== size))
    } else {
      setSizes(prev => [...prev, size])
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!name || !description || !price) {
      toast.error('Please fill all required fields')
      return
    }

    if (sizes.length === 0) {
      toast.error('Please select at least one size')
      return
    }

    if (!image1 && !image2 && !image3 && !image4) {
      toast.error('Please upload at least one image')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (response.data.success) {
        toast.success('Product added successfully!')

        setName('')
        setDescription('')
        setPrice('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSizes([])
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>

      <div style={{ marginBottom: '25px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '5px'
        }}>
          Add New Product
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          Fill in the details below to add a new product to your store
        </p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >

        {/* Image Upload */}
        <div style={{ marginBottom: '25px' }}>
          <label style={labelStyle}>Upload Images (Max 4)</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { state: image1, setState: setImage1, id: 'image1' },
              { state: image2, setState: setImage2, id: 'image2' },
              { state: image3, setState: setImage3, id: 'image3' },
              { state: image4, setState: setImage4, id: 'image4' }
            ].map((img, index) => (
              <label
                key={index}
                htmlFor={img.id}
                style={{
                  width: '110px',
                  height: '110px',
                  border: '2px dashed #cbd5e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#f8fafc',
                  overflow: 'hidden'
                }}
              >
                {!img.state ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                    <p style={{ fontSize: '24px' }}>📷</p>
                    <p style={{ fontSize: '11px' }}>Upload</p>
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(img.state)}
                    alt=''
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <input
                  type='file'
                  id={img.id}
                  hidden
                  onChange={(e) => img.setState(e.target.files[0])}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Product Name *</label>
          <input
            type='text'
            placeholder='e.g., Men Cotton T-Shirt'
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Description *</label>
          <textarea
            placeholder='Write product description here...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows='4'
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {/* Category & SubCategory & Price */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value='Men'>Men</option>
              <option value='Women'>Women</option>
              <option value='Kids'>Kids</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Sub Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              style={inputStyle}
            >
              <option value='Topwear'>Topwear</option>
              <option value='Bottomwear'>Bottomwear</option>
              <option value='Winterwear'>Winterwear</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Price ($) *</label>
            <input
              type='number'
              placeholder='100'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Sizes */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Available Sizes</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size, index) => (
              <button
                key={index}
                type='button'
                onClick={() => toggleSize(size)}
                style={{
                  padding: '10px 20px',
                  border: sizes.includes(size) ? '2px solid #ec4899' : '1px solid #e2e8f0',
                  background: sizes.includes(size) ? '#fce7f3' : 'white',
                  color: sizes.includes(size) ? '#831843' : '#475569',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: '0.2s'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#475569'
          }}>
            <input
              type='checkbox'
              checked={bestseller}
              onChange={() => setBestseller(prev => !prev)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            Mark as Bestseller ⭐
          </label>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          style={{
            padding: '14px 50px',
            background: loading ? '#666' : 'linear-gradient(135deg, #000 0%, #333 100%)',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            transition: '0.2s'
          }}
        >
          {loading ? 'Adding Product...' : 'ADD PRODUCT'}
        </button>
      </form>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#475569'
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  background: 'white'
}

export default Add