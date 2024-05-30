import React from "react";
import { formatter } from "../../../../utils/formater";
import axios from "axios";
import getCustomerID from "../../custumer/APIcustumerIP";
import { useNavigate } from "react-router-dom";

const Summary = ({ cartItems }) => {
  const navigate = useNavigate();

  //total summary for cart summary
  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  //add 2% tax on the totalAmount
  const taxAmount = totalAmount * 0.02;

  //total quantity in the cart
  const totalQuantity = cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  //overal price
  const totalAmountWithTax = totalAmount + taxAmount;

  const handleOrder = async () => {
    const confirmOrder = window.confirm("Bạn có chắc chắn muốn đặt hàng?");
    if (confirmOrder) {
      const customerId = await getCustomerID();
      const token = sessionStorage.getItem("accessToken");

      const orderData = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      try {
        await axios.post(
          `http://localhost:5003/api/order/create-order/${customerId}`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/order-success");
      } catch (error) {
        console.error("Error creating order: ", error);
      }
    }
  };

  return (
    <div className="cart-summary">
      <h3 className="summary-title">Thanh toán</h3>
      <div className="summary-total">
        <span>Tổng tiền</span>
        {formatter(totalAmount)}
      </div>

      <div className="summary-total-quantity">
        <span>Tổng sản phẩm</span> {totalQuantity}
      </div>
      <div className="summary-total-amount">
        <span>Tạm tính</span>
        {formatter(totalAmountWithTax)}
      </div>
      <button className="check-out-btn" onClick={handleOrder}>
        Đặt hàng
      </button>
    </div>
  );
};

export default Summary;
