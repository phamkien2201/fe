import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetchProduct } from "./useFetchProduct";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { product, error } = useFetchProduct();
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  useEffect(() => {
    if (product) {
      console.log(product); // Hoặc xử lý product tại đây
    }
    if (error) {
      console.error("Failed to fetch product:", error);
    }
  }, [product, error]);

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );
    product.quantity = product.quantity || 1;

    if (existingItemIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, product]);
    }
    toast.success("Thêm sản phẩm vào giỏ hàng thành công!");
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const removeQuantity = (productId) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === productId
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity -= 1;
      if (updatedItems[existingItemIndex].quantity === 0) {
        removeFromCart(productId);
      } else {
        setCartItems(updatedItems);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, removeQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
