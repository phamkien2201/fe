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
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

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

          let totalQuantity = 0;
          let totalAmount = 0;

          data.data.forEach((orderItem) => {
            totalQuantity += orderItem.quantity;
            totalAmount += orderItem.price * orderItem.quantity;
          });

          setTotalQuantity(totalQuantity);
          setTotalAmount(totalAmount);

          const productIds = data.data.map((item) => item.productId); // Lấy ra tất cả các productId từ mảng data
          const productDetailsPromises = productIds.map(async (productId) => {
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
            return productData.data;
          });

          Promise.all(productDetailsPromises)
            .then((productDetails) => {
              setProductDetails(productDetails);
            })
            .catch((error) => {
              toast.error("Failed to fetch product details");
            });
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
      {orderDetails.length > 0 && productDetails.length > 0 ? (
        <>
          {orderDetails.map((orderItem, index) => (
            <div className="order-details" key={index}>
              <div className="product-details">
                <img
                  src={productDetails[index]?.imageUrl[0]}
                  alt={productDetails[index]?.tenSanPham}
                />
              </div>
              <div className="order-info">
                <h3>{productDetails[index]?.tenSanPham}</h3>
                <p>
                  <strong>Quantity:</strong> {orderItem.quantity}
                </p>
                <p>
                  <strong>Price:</strong> {formatter(orderItem.price)}
                </p>
              </div>
            </div>
          ))}
          <div className="total-amount">
            <table>
              <thead>
                <tr>
                  <th>Tổng số lượng</th>
                  <th>Tổng tiền tạm tính</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{totalQuantity}</td>
                  <td>{formatter(totalAmount)}</td>
                  <td>{formatter(totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderDetails;
