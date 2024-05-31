import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CartScreen.css";

const CartScreen = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchOrders(token);
    }
  }, [navigate]);

  useEffect(() => {
    filterOrders(selectedStatus);
  }, [orders, selectedStatus]);

  const fetchOrders = async (token) => {
    try {
      const customerId = sessionStorage.getItem("customerId");
      const apiUrl = `http://localhost:5003/api/order/don-hang-cua-toi/${customerId}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ordersData = response.data.data;

      // Fetch product details for each order
      const ordersWithProductDetails = await Promise.all(
        ordersData.map(async (order) => {
          const detailUrl = `http://localhost:5003/api/order/chi-tiet-don-hang/${order.id}`;
          const detailResponse = await axios.get(detailUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const firstProduct =
            detailResponse.data.data.length > 0
              ? detailResponse.data.data[0]
              : null;

          if (firstProduct) {
            const productResponse = await fetch(
              `http://localhost:5001/api/product/${firstProduct.productId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const productData = await productResponse.json();
            const productDetails = productData.data;
            return {
              ...order,
              productDetails,
              quantity: firstProduct.quantity,
              price: productDetails.price.giaTienHienTai,
            };
          } else {
            return { ...order, productDetails: null };
          }
        })
      );

      setOrders(ordersWithProductDetails);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filterOrders = (status) => {
    if (status === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
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
      <div className="product-order-container">
        {filteredOrders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào</p>
        ) : (
          filteredOrders.map((order) =>
            order.productDetails ? (
              <div key={order.id} className="product-order">
                <img
                  src={order.productDetails.imageUrl[0]}
                  alt={order.productDetails.tenSanPham}
                  className="product-order-image"
                />
                <div className="product-order-info">
                  <p className="product-order-name">
                    {order.productDetails.tenSanPham}
                  </p>
                  <div className="product-order-details">
                    <span>Số lượng: {order.quantity}</span>
                    <span className="product-order-price">
                      Giá: {order.price}đ
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={order.id} className="product-order">
                <p className="product-order-name">Sản phẩm không tồn tại</p>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default CartScreen;
