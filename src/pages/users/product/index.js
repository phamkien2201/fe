import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.scss";
import { BsPlusLg, BsDash } from "react-icons/bs";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { formatter } from "../../../utils/formater";
import getCustomerID from "../custumer/APIcustumerIP";
import axios from "axios";

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
  const [shortDescription, setShortDescription] = useState("");

  const handleAdd = async (product) => {
    const token = sessionStorage.getItem("accessToken");
    const customerId = await getCustomerID();

    console.log("token", token);
    fetch(
      `http://localhost:5003/api/cart/get-cart-by-customerid/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(async (data) => {
        if (data && data.data) {
          console.log("cart id", data.data.id);
          try {
            const response = await axios.post(
              `http://localhost:5003/api/cart/add-item-to-cart/${data.data.id}`,
              {
                quantity: quantity,
                price: product.price.giaTienHienTai,
                productId: productId,
              },
              {
                headers: {
                  Accept: "*/*",
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("Response:", response.data);
            toast.success("Thêm giỏ hàng thành công");
            setQuantity(1);
          } catch (error) {
            console.error("Error saving user data to server:", error);
            throw error;
          }
        } else {
          throw new Error("Error by API");
        }
      })
      .catch((err) => console.error("Error fetching data: ", err));
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

  // các phần khác của code giống như trước
  // State để kiểm soát hiển thị mở rộng

  // Hàm để toggle trạng thái mở rộng
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Style cho phần mô tả sản phẩm
  const descriptionStyle = {
    maxHeight: isExpanded ? "none" : "500px", // Giới hạn chiều cao khi chưa mở rộng
    overflow: "hidden", // Ẩn nội dung thừa
    textOverflow: "ellipsis", // Thêm ba chấm nếu nội dung bị cắt ngắn
    whiteSpace: isExpanded ? "normal" : "nowrap", // Đảm bảo không xuống dòng khi chưa mở rộng
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
