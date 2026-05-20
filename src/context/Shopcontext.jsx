import { createContext, useState } from 'react'

export const ShopContext = createContext()

const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (item, size) => {
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
  }

  const removeFromCart = (id, size) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item._id === id && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const deleteFromCart = (id, size) => {
    setCartItems(prev =>
      prev.filter(item => !(item._id === id && item.size === size))
    )
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <ShopContext.Provider value={{ cartItems, addToCart, removeFromCart, deleteFromCart, cartCount }}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider