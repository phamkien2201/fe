import React, { useEffect, useState } from "react";
import "./CartContainer.css";
import { TbMinus, TbPlus, TbX } from "react-icons/tb";
import { formatter } from "../../../../utils/formater";
import axios from "axios";

const Item = ({ item, handleRemove, handleFetchCart }) => {
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    setQuantity(item.quantity);
    fetch(`http://localhost:5001/api/product/${item.productId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setProduct(data.data);
        } else {
          throw new Error("Product not found");
        }
      })
      .catch((err) => console.error("Error fetching data: ", err));
  }, [item]);

  const handleChangeQuan = async (quantityUpdate) => {
    const token = sessionStorage.getItem("accessToken");
    setQuantity(quantityUpdate);
    try {
      await axios.put(
        `http://localhost:5003/api/cart/update-item/${item.id}`,
        {
          quantity: quantityUpdate,
          price: item.price,
        },

        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleFetchCart();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="item-detail">
      <div className="item-info">
        <div className="item-image">
          <img src={product?.imageUrl[0]} alt={product?.tenSanPham} />
        </div>
        <div className="item-title">{product?.tenSanPham}</div>
      </div>
      <div className="item-unit-price">
        {formatter(product?.price.giaTienGoc)}
      </div>
      <div className="item-quantity">
        <div className="quantity-button">
          <TbMinus
            onClick={() => {
              if (quantity === 1) {
                return;
              }
              handleChangeQuan(quantity - 1);
            }}
          />
        </div>
        {item.quantity}
        <div className="quantity-button">
          <TbPlus
            onClick={() => {
              handleChangeQuan(quantity + 1);
            }}
          />
        </div>
      </div>
      <div className="item-total-price">
        {formatter(product?.price.giaTienGoc * item.quantity)}
      </div>
      <div className="item-remove" onClick={() => handleRemove(item.id)}>
        <TbX />
      </div>
    </div>
  );
};

export default Item;
