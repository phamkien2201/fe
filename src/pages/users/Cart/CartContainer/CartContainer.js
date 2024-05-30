import React, { useEffect, useState } from "react";
import "./CartContainer.css";
import Item from "./Item";
import Summary from "./Summary";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getCustomerID from "../../custumer/APIcustumerIP";
import axios from "axios";

const CartContainer = () => {
  const [displayemail, displayemailupdate] = useState("");
  const [showmenu, showmenuupdateupdate] = useState(false);
  const usenavigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);

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

  useEffect(() => {
    handleFetchCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (confirm) {
      const token = sessionStorage.getItem("accessToken");

      try {
        await axios.delete(
          `http://localhost:5003/api/cart/delete-item/${cartItemId}`,
          {
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        handleFetchCart();
        toast.success("Xóa thành công");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleFetchCart = async () => {
    const customerId = await getCustomerID();
    const token = sessionStorage.getItem("accessToken");
    fetch(
      `http://localhost:5003/api/cart/get-cart-by-customerid/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          fetch(
            `http://localhost:5003/api/cart/get-cart-item/${data.data.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.data) {
                setCartItems(data.data);
              } else {
                throw new Error("Error by API");
              }
            })
            .catch((err) => console.error("Error fetching data: ", err));
        } else {
          throw new Error("Error by API");
        }
      })
      .catch((err) => console.error("Error fetching data: ", err));
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
                      handleRemove={() => handleRemove(item.id)}
                      handleFetchCart={handleFetchCart}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-item">
                <p> No item in the cart</p>
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
