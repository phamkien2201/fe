import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetchCustomerProducts } from "./useFetchCustomerProducts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { products: initialProducts, error } = useFetchCustomerProducts();
  const [products, setProducts] = useState(initialProducts || []);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
    if (error) {
      console.error("Failed to fetch customer products:", error);
    }
  }, [initialProducts, error]);

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      product.quantity = product.quantity || 1;
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

  const checkout = async (customerId) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Access token not found");
      }

      // Thực hiện yêu cầu GET để kiểm tra đơn hàng
      const response = await fetch(
        `http://localhost:5003/api/order/don-hang-cua-toi/${customerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.succeeded && data.data && data.data.length > 0) {
        setCartItems([]);
        toast.success("Đặt hàng thành công");
      } else {
        throw new Error("No orders found");
      }
    } catch (error) {
      toast.error("Đặt hàng thất bại");
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, removeQuantity, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
