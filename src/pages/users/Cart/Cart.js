import React, { memo } from "react";
import CartContainer from "./CartContainer/CartContainer";

const Cart = () => {
  return (
    <div className="cart-page">
      <CartContainer />
    </div>
  );
};

export default memo(Cart);
