import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./orderDetails.scss";
import { formatter } from "../../utils/formater";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5003/api/order/chi-tiet-don-hang/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (data.succeeded && data.data.length > 0) {
          setOrderDetails(data.data);

          const productId = data.data[0]?.productId;
          if (productId) {
            const productResponse = await fetch(
              `http://localhost:5001/api/product/${productId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const productData = await productResponse.json();

            if (productData.succeeded) {
              setProductDetails(productData.data);
            } else {
              toast.error("Failed to fetch product details");
            }
          }
        } else {
          toast.error("Failed to fetch order details");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      {orderDetails.length > 0 && Object.keys(productDetails).length > 0 ? (
        <div className="order-details">
          <div className="product-details">
            <img
              src={productDetails.imageUrl[0]}
              alt={productDetails.tenSanPham}
            />
            <h3>{productDetails.tenSanPham}</h3>
          </div>
          <div className="order-info">
            <p>
              <strong>Quantity:</strong> {orderDetails[0].quantity}
            </p>
            <p>
              <strong>Price:</strong> {formatter(orderDetails[0].price)}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderDetails;
