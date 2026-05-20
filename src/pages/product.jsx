import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../assets/assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'

const Product = () => {

  const { productId } = useParams()

  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  const { addToCart } = useContext(ShopContext)

  useEffect(() => {

    const product = products.find((item) => item._id === productId)

    if(product){
      setProductData(product)
      setImage(product.image[0])
    }

  }, [productId])

  if(!productData){
    return <div>Loading...</div>
  }

  return (

    <div style={{padding:'40px 6%'}}>

      <div
        style={{
          display:'flex',
          gap:'50px',
          flexWrap:'wrap'
        }}
      >

        {/* LEFT */}

        <div
          style={{
            display:'flex',
            gap:'15px',
            flex:'1'
          }}
        >

          {/* SMALL IMAGES */}

          <div
            style={{
              display:'flex',
              flexDirection:'column',
              gap:'12px'
            }}
          >

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

          {/* BIG IMAGE */}

          <div>

            <img
              src={image}
              alt=''
              style={{
                width:'500px',
                maxWidth:'100%',
                objectFit:'cover'
              }}
            />

          </div>

        </div>

        {/* RIGHT */}

        <div style={{flex:'1'}}>

          <h1
            style={{
              fontSize:'32px',
              marginBottom:'15px'
            }}
          >
            {productData.name}
          </h1>

          <div
            style={{
              display:'flex',
              alignItems:'center',
              gap:'5px',
              marginBottom:'20px'
            }}
          >
            ⭐⭐⭐⭐☆
            <span>(122)</span>
          </div>

          <h2
            style={{
              fontSize:'34px',
              marginBottom:'20px'
            }}
          >
            ${productData.price}
          </h2>

          <p
            style={{
              color:'#555',
              lineHeight:'28px',
              marginBottom:'30px'
            }}
          >
            {productData.description}
          </p>

          <p style={{marginBottom:'15px'}}>Select Size</p>

          <div
            style={{
              display:'flex',
              gap:'12px',
              marginBottom:'30px'
            }}
          >

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

          {/* ADD TO CART */}

          <button
            onClick={()=>{

              if(size===''){
                alert('Please select a size')
              }
              else{
                addToCart(productData, size)
                alert(`Added to cart - Size ${size}`)
              }

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

          <div
            style={{
              color:'#555',
              lineHeight:'28px'
            }}
          >
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>

        </div>

      </div>

      {/* DESCRIPTION + REVIEW */}

      <div
        style={{
          marginTop:'80px',
          border:'1px solid #ddd'
        }}
      >

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
            Reviews (122)
          </button>

        </div>

        <div
          style={{
            padding:'30px',
            color:'#555',
            lineHeight:'28px'
          }}
        >

          {activeTab==='description' ? (

            <>
              <p>
                An e-commerce website is an online platform that facilitates buying and selling products online.
              </p>

              <p style={{marginTop:'20px'}}>
                Products are displayed with descriptions, prices, images and detailed information.
              </p>
            </>

          ) : (

            <div style={{display:'flex', flexDirection:'column', gap:'25px'}}>

              <div>
                <p>⭐⭐⭐⭐⭐</p>
                <h4>Very good product</h4>
                <p>Quality is amazing. Worth buying.</p>
              </div>

              <hr />

              <div>
                <p>⭐⭐⭐⭐⭐</p>
                <h4>Nice Product</h4>
                <p>Looks exactly same as shown in image.</p>
              </div>

              <hr />

              <div>
                <p>⭐⭐⭐⭐☆</p>
                <h4>Good quality</h4>
                <p>Fabric quality is very comfortable.</p>
              </div>

            </div>

          )}

        </div>

      </div>

      {/* RELATED PRODUCTS */}

      <div style={{marginTop:'90px'}}>

        <div
          style={{
            textAlign:'center',
            marginBottom:'40px'
          }}
        >
          <h2
            style={{
              fontSize:'32px',
              fontWeight:'400'
            }}
          >
            RELATED <b>PRODUCTS</b> ─
          </h2>
        </div>

        <div
          style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
            gap:'25px'
          }}
        >

          {products
            .filter((item)=>item.category===productData.category)
            .slice(0,5)
            .map((item,index)=>(

              <Link
                key={index}
                to={`/product/${item._id}`}
                style={{
                  textDecoration:'none',
                  color:'black'
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
                      width:'100%',
                      height:'300px',
                      objectFit:'cover',
                      transition:'0.3s ease-in-out'
                    }}
                  />

                  <p style={{marginTop:'12px'}}>
                    {item.name}
                  </p>

                  <p style={{fontWeight:'600'}}>
                    ${item.price}
                  </p>

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