import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.scss";
import { BsPlusLg, BsDash } from "react-icons/bs";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { formatter } from "../../../utils/formater";
import { useCart } from "../Cart/CartContainer/CartContext";
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        background: "grey",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        background: "grey",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
}

function ImageSlider({ images }) {
  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Slider {...settings}>
      {images.map((img, index) => (
        <div key={index}>
          <img src={img} alt={`Slide ${index}`} style={{ width: "100%" }} />
        </div>
      ))}
    </Slider>
  );
}

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart } = useCart();
  const [shortDescription, setShortDescription] = useState("");

  const handleAdd = (product) => {
    addToCart(product);
  };
  function truncateToSentences(text, maxSentences) {
    const sentences = text.split(".");
    if (sentences.length <= maxSentences) {
      return text;
    }

    return sentences.slice(0, maxSentences).join(".") + ".";
  }

  useEffect(() => {
    fetch(`http://localhost:5001/api/product/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setProduct(data.data);
          setShortDescription(`${data.data.moTaSanPham.substring(0, 100)}...`);
          const limitedDescription = truncateToSentences(
            data.data.moTaSanPham,
            5
          );
          setProduct({
            ...data.data,
            moTaSanPham: limitedDescription,
          });
        } else {
          throw new Error("Product not found");
        }
      })
      .catch((err) => console.error("Error fetching data: ", err));
  }, [productId]);

  function handleQuantityChange(event) {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity >= 1 ? newQuantity : 1);
  }

  if (!product) return <div>Loading...</div>;
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const descriptionStyle = {
    maxHeight: isExpanded ? "none" : "500px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: isExpanded ? "normal" : "nowrap",
    transition: "max-height 0.3s ease-in-out",
  };

  return (
    <div className="main-product">
      <div className="container-product">
        <div className="product-images">
          {product.imageUrl && <ImageSlider images={product.imageUrl} />}
        </div>
        <div className="product-info">
          <h1>{product.tenSanPham}</h1>
          <h2>
            {formatter(product.price.giaTienGoc)} / {product.quyCach}
          </h2>
          <h3>Đơn vị tính: {product.donViTinh}</h3>
          <h3>Quy cách: {product.quyCach}</h3>
          <h3>Xuất xứ thương hiệu: {product.xuatXu}</h3>
          <h3>Nhà sản xuất: {product.nhaSanXuat}</h3>
          <h3>Mô tả ngắn: {product.moTaNgan}</h3>
          <div className="product-quantity">
            <button
              className="quantity-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <BsDash />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
            />
            <button
              className="quantity-btn"
              onClick={() => setQuantity(quantity + 1)}
            >
              <BsPlusLg />
            </button>
          </div>
          <button
            className="add-to-cart-btn"
            onClick={() => handleAdd(product)}
          >
            Thêm vào giỏ hàng
          </button>
          <ToastContainer />
        </div>
      </div>
      <div className="product-description" style={descriptionStyle}>
        {isExpanded ? (
          <>
            <div className="description-item">
              <h4>Mô tả Sản Phẩm:</h4>
              <p>{product.moTaSanPham}</p>
            </div>
            <div className="description-item">
              <h4>Thành Phần:</h4>
              <ul>
                {Object.entries(product.thanhPhan).map(
                  ([key, value], index) => (
                    <li key={index}>
                      {key}: {value}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="description-item">
              <h4>Công dụng:</h4>
              <p>{product.congDung}</p>
            </div>
            <div className="description-item">
              <h4>Tác dụng phụ:</h4>
              <p>{product.tacDungPhu}</p>
            </div>
            <div className="description-item">
              <h4>Lưu ý:</h4>
              <p>{product.luuY}</p>
            </div>
            <div className="description-item">
              <h4>Bảo quản:</h4>
              <p>{product.baoQuan}</p>
            </div>
          </>
        ) : (
          <div className="description-item">
            <h4>Mô tả Sản Phẩm:</h4>
            <p>{shortDescription}</p>
          </div>
        )}
      </div>
      <div
        className="expand-toggle"
        onClick={toggleExpand}
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <span>
          {isExpanded ? (
            <>
              <AiFillCaretUp /> Thu gọn
            </>
          ) : (
            <>
              <AiFillCaretDown /> Xem thêm
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default ProductDetails;
