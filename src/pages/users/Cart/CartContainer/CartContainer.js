import React, { useEffect, useState } from "react";
import "./CartContainer.css";
import Item from "./Item";
import Summary from "./Summary";
import { useCart } from "./CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContainer = () => {
  const [displayemail, displayemailupdate] = useState("");
  const [showmenu, showmenuupdateupdate] = useState(false);
  const usenavigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      showmenuupdateupdate(false);
    } else {
      showmenuupdateupdate(true);
      let email = sessionStorage.getItem("email");
      if (email === "" || email === null) {
        usenavigate("/login");
      } else {
        displayemailupdate(email);
      }
    }
  }, [location]);
  const { cartItems, removeFromCart, addToCart, removeQuantity } = useCart();

  //add item
  const handleAdd = (product) => {
    addToCart(product);
  };
  //remove item
  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  //remove item quantity
  const handleRemoveQuantity = (productId) => {
    removeQuantity(productId);
  };
  return (
    <>
      {showmenu && (
        <div className="featured-cart">
          <div className="section-title-cart">
            <h2>Giỏ hàng</h2>
          </div>
          <div className="cart-container">
            {cartItems && cartItems.length > 0 ? (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      handleRemove={handleRemove}
                      handleAdd={handleAdd}
                      handleRemoveQuantity={handleRemoveQuantity}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-item">
                <h2> No item in the cart</h2>
              </div>
            )}
            <Summary cartItems={cartItems} />
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default CartContainer;
