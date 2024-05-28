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
      const customerId = sessionStorage.getItem("customerId"); // Lấy customerId từ sessionStorage
      let apiUrl = `http://localhost:5003/api/order/don-hang-cua-toi/${customerId}`; // Sử dụng customerId trong URL
      if (status !== "all") {
        apiUrl += `?status=${status}`;
      }
      const response = await axios.get(apiUrl);
      setProducts(response.data);
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
          onClick={() => setSelectedStatus("onprocess")}
          className={selectedStatus === "onprocess" ? "active" : ""}
        >
          Đang xử lý
        </button>
        <button
          onClick={() => setSelectedStatus("delivering")}
          className={selectedStatus === "delivering" ? "active" : ""}
        >
          Đang giao
        </button>
        <button
          onClick={() => setSelectedStatus("delivered")}
          className={selectedStatus === "delivered" ? "active" : ""}
        >
          Đã giao
        </button>
        <button
          onClick={() => setSelectedStatus("cancel")}
          className={selectedStatus === "cancel" ? "active" : ""}
        >
          Đã hủy
        </button>
        <button
          onClick={() => setSelectedStatus("return")}
          className={selectedStatus === "return" ? "active" : ""}
        >
          Trả hàng
        </button>
      </div>
      <div className="product-container">
        {products.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              p={{
                id: product.id,
                timeCreated: product.timeCreated,
                imageUrl: product.imageUrl,
                name: product.name,
                price: product.price,
                status: product.status,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CartScreen;
