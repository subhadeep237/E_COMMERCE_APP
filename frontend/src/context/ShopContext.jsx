import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [cartItems, setCartItems] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [products, setProducts] = useState([])

  console.log('🔵 ShopContext loaded. Token:', token ? 'EXISTS' : 'NO TOKEN')

  // Initial load
  useEffect(() => {
    console.log('🟢 Initial useEffect running...')

    const initApp = async () => {
      try {
        console.log('📦 Fetching products...')
        const response = await axios.get(backendUrl + '/api/product/list?all=true')

        if (response.data.success) {
          console.log('✅ Products fetched:', response.data.products.length)
          setProducts(response.data.products)

          if (token) {
            console.log('🔑 Token found, fetching cart...')
            await fetchCart(token, response.data.products)
          } else {
            console.log('❌ No token, skipping cart fetch')
          }
        }
      } catch (error) {
        console.log('🔴 Error:', error)
      }
    }

    initApp()
  }, [])

  // Fetch cart function
  const fetchCart = async (userToken, productsList) => {
    try {
      console.log('🛒 Fetching cart from backend...')
      const response = await axios.get(backendUrl + '/api/user/cart', {
        headers: { Authorization: `Bearer ${userToken}` }
      })

      console.log('📥 Cart response:', response.data)

      if (response.data.success) {
        const backendCart = response.data.cartData || {}
        const cartArray = []

        for (const productId in backendCart) {
          for (const size in backendCart[productId]) {
            const product = productsList.find(p => p._id === productId)
            if (product) {
              cartArray.push({
                _id: productId,
                name: product.name,
                image: product.image,
                price: product.price,
                size: size,
                quantity: backendCart[productId][size]
              })
            }
          }
        }

        console.log('🎯 Cart items to set:', cartArray.length)
        setCartItems(cartArray)
      }
    } catch (error) {
      console.log('🔴 Cart fetch error:', error)
    }
  }

  // Handle token changes
  useEffect(() => {
    if (token && products.length > 0) {
      fetchCart(token, products)
    }
    if (!token) {
      setCartItems([])
    }
  }, [token])

  // ADD TO CART
  const addToCart = async (item, size) => {
    if (!size) return

    const existingItem = cartItems.find(
      (product) => product._id === item._id && product.size === size
    )

    if (existingItem) {
      setCartItems(prev =>
        prev.map(product =>
          product._id === item._id && product.size === size
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      )
    } else {
      setCartItems(prev => [
        ...prev,
        {
          _id: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          size: size,
          quantity: 1
        }
      ])
    }

    if (token) {
      try {
        console.log('💾 Saving to backend cart...')
        const res = await axios.post(
          backendUrl + '/api/user/cart/add',
          { productId: item._id, size: size },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        console.log('✅ Saved to backend:', res.data)
      } catch (error) {
        console.log('🔴 Add to cart error:', error)
      }
    } else {
      console.log('⚠️ No token, not saving to backend')
    }
  }

  // REMOVE FROM CART (decrease quantity)
  const removeFromCart = async (id, size) => {
    const updatedItem = cartItems.find(item => item._id === id && item.size === size)
    const newQuantity = updatedItem ? updatedItem.quantity - 1 : 0

    setCartItems(prev =>
      prev
        .map(item =>
          item._id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    )

    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/user/cart/update',
          { productId: id, size: size, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (error) {
        console.log(error)
      }
    }
  }

  // DELETE FROM CART (remove completely)
  const deleteFromCart = async (id, size) => {
    setCartItems(prev =>
      prev.filter(item => !(item._id === id && item.size === size))
    )

    if (token) {
      try {
        await axios.post(
          backendUrl + '/api/user/cart/update',
          { productId: id, size: size, quantity: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (error) {
        console.log(error)
      }
    }
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <ShopContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      deleteFromCart,
      cartCount,
      token,
      setToken,
      backendUrl,
      products,
      setProducts
    }}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider