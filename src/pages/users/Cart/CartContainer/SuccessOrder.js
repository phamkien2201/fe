import React from "react";
import { BiCheckCircle } from "react-icons/bi";
import "./SuccessOrder.scss";

const SuccessOrder = () => {
  return (
    <div className="success-order-container">
      <div className="success-icon">
        <BiCheckCircle />
      </div>
      <h1 className="success-title">Đặt hàng thành công</h1>
      <p className="success-message">
        Đơn hàng của bạn đang được xử lý, vui lòng theo dõi đơn hàng{" "}
        <a href="/custumer">tại đây</a>.
      </p>
    </div>
  );
};

export default SuccessOrder;
