import React from "react";
import { formatter } from "../../../../utils/formater";

const Summary = ({ cartItems }) => {
  //total summary for cart summary
  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.price.giaTienHienTai * item.quantity;
  }, 0);

  //add 2% tax on the totalAmount
  const taxAmount = totalAmount * 0.02;

  //total quantity in the cart
  const totalQuantity = cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  //overal price
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
      <button className="check-out-btn">Đặt hàng</button>
    </div>
  );
};

export default Summary;
