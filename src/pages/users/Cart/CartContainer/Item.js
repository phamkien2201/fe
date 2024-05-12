import React from "react";
import "./CartContainer.css";
import { TbMinus, TbPlus, TbX } from "react-icons/tb";
import { formatter } from "../../../../utils/formater";

const Item = ({ item, handleRemove, handleAdd, handleRemoveQuantity }) => {
  return (
    <div className="item-detail">
      <div className="item-info">
        <div className="item-image">
          <img src={item.imageUrl[0]} alt={item.tenSanPham} />
        </div>
        <div className="item-title">{item.tenSanPham}</div>
      </div>
      <div className="item-unit-price">{formatter(item.price.giaTienGoc)}</div>
      <div className="item-quantity">
        <div className="quantity-button">
          <TbMinus onClick={() => handleRemoveQuantity(item.id)} />
        </div>
        {item.quantity}
        <div className="quantity-button">
          <TbPlus onClick={() => handleAdd(item)} />
        </div>
      </div>
      <div className="item-total-price">
        {formatter(item.price.giaTienGoc * item.quantity)}
      </div>
      <div className="item-remove" onClick={() => handleRemove(item.id)}>
        <TbX />
      </div>
    </div>
  );
};

export default Item;
