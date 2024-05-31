import React from "react";
import { formatter } from "../../../../utils/formater";
import axios from "axios";
import getCustomerID from "../../custumer/APIcustumerIP";
import { useNavigate } from "react-router-dom";

const Summary = ({ cartItems }) => {
  const navigate = useNavigate();

  const handleOrder = async () => {
    const confirmOrder = window.confirm("Bạn có chắc chắn muốn đặt hàng?");
    if (confirmOrder) {
      const token = sessionStorage.getItem("accessToken");

      const customerId = await getCustomerID();

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

        // Xóa từng sản phẩm trong giỏ hàng sau khi đặt hàng thành công
        await Promise.all(
          cartItems.map(async (item) => {
            try {
              await axios.delete(
                `http://localhost:5003/api/cart/delete-item/${item.id}`,
                {
                  headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch (error) {
              console.error("Lỗi khi xóa sản phẩm từ giỏ hàng: ", error);
            }
          })
        );

        navigate("/order-success");
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng: ", error);
      }
    }
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Tính thuế
  const taxAmount = totalAmount * 0.02;

  // Tổng số lượng sản phẩm
  const totalQuantity = cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  // Tổng tiền với thuế
  const totalAmountWithTax = totalAmount + taxAmount;

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
