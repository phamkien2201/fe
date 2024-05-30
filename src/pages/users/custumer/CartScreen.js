import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../Cart/Cart";
import "./CartScreen.css";

const CartScreen = () => {
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchProducts(selectedStatus);
  }, [selectedStatus]);

  const fetchProducts = async (status) => {
    try {
      const customerId = sessionStorage.getItem("customerId");
      let apiUrl = `http://localhost:5003/api/order/don-hang-cua-toi/${customerId}`;
      const response = await axios.get(apiUrl);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="cart">
      <div className="horizonal-tab-menu">
        <button
          onClick={() => setSelectedStatus("all")}
          className={selectedStatus === "all" ? "active" : ""}
        >
          Tất cả
        </button>
        <button
          onClick={() => setSelectedStatus("PENDING")}
          className={selectedStatus === "PENDING" ? "active" : ""}
        >
          Đang xử lý
        </button>
        <button
          onClick={() => setSelectedStatus("CONFIRMED")}
          className={selectedStatus === "CONFIRMED" ? "active" : ""}
        >
          Đang giao
        </button>
        <button
          onClick={() => setSelectedStatus("COMPLETE")}
          className={selectedStatus === "COMPLETE" ? "active" : ""}
        >
          Đã giao
        </button>
        <button
          onClick={() => setSelectedStatus("CANCELLED")}
          className={selectedStatus === "CANCELLED" ? "active" : ""}
        >
          Đã hủy
        </button>
      </div>
      <div className="product-container">
        {products.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào</p>
        ) : (
          products.map((product) => (
            <div key={product.id}>{product.id}</div> // Hiển thị ID của đơn hàng
          ))
        )}
      </div>
    </div>
  );
};

export default CartScreen;
