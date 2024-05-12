import React, { useEffect, useState, memo } from "react";
import "./style.scss";
import "react-toastify/dist/ReactToastify.css";
import Slideshow from "./Slideshow"; // Đảm bảo bạn đã import Slideshow
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { Link } from "react-router-dom";
import slideshow1 from "../../../pages/pic/Banner_mobile_7_574d7a1cc1.jpg";
import slideshow2 from "../../../pages/pic/Banner_Web_MB_640x320_92c0a7984e.jpg";
import slideshow3 from "../../../pages/pic/Banner_web_Mobile_df4b8515ea.webp";
import benh1 from "../../../assets/users/images/disease/sotxuathuyet.jpg";
import benh2 from "../../../assets/users/images/disease/ebola.jpg";
import benh3 from "../../../assets/users/images/disease/cum.jpg";
import benh4 from "../../../assets/users/images/disease/taychanmieng.jpg";
import benh5 from "../../../assets/users/images/disease/daumatdo.jpg";
import benh6 from "../../../assets/users/images/disease/camlanh.jpg";
import benh7 from "../../../assets/users/images/disease/daumuakhi.jpg";
import benh8 from "../../../assets/users/images/disease/h3n2.jpg";
import benh9 from "../../../assets/users/images/disease/nam.jpg";
import benh10 from "../../../assets/users/images/disease/nu.jpg";
import benh11 from "../../../assets/users/images/disease/gia.jpg";
import benh12 from "../../../assets/users/images/disease/tre.jpg";
import { formatter } from "../../../utils/formater";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/product/categoryId?categoryId=74932732-91c5-430f-b64c-8837f58fca03"
        );
        const data = await response.json();
        console.log(data.data);
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const slideshowImages = [slideshow1, slideshow2, slideshow3];
  const featProducts = {
    all: {
      title: "Bệnh theo mùa",
      products: [
        {
          img: benh1,
          name: "Sốt xuất huyết Dengue",
          detail:
            "Sốt xuất huyết Dengue là một bệnh truyền nhiễm do muỗi Aedes truyền từ người sang người, thường xảy ra ở các khu vực nhiệt đới, cận nhiệt...",
        },
        {
          img: benh2,
          name: "Ebola",
          detail:
            "Ebola là một căn bệnh truyền nhiễm hiếm gặp nhưng có thể gây nguy cơ tử vong cao ở người. Bệnh do virus Ebola truyền từ động vật hoang dã...",
        },
        {
          img: benh3,
          name: "Cúm",
          detail:
            "Bệnh cúm là bệnh truyền nhiễm, gây ra do nhiễm virus cúm. Virus có thể gây bệnh từ nhẹ tới nặng, hoặc thậm chí gây tử vong. Do đó, cần tìm hiểu...",
        },
        {
          img: benh4,
          name: "Bệnh tay, chân, miệng",
          detail:
            "Bệnh tay, chân, miệng là bệnh do virus gây ra, có khả năng lây lan rất nhanh chóng và do đó, rất dễ hình thành dịch bệnh. Bệnh có thể xuất hiện ở...",
        },
        {
          img: benh5,
          name: "Đau mắt đỏ",
          detail:
            "Đau mắt đỏ hay viêm kết mạc, là tình trạng xảy ra do mắt bị nhiễm vi khuẩn, virus hay dị vật gây dị ứng, gây ra các triệu chứng xung huyết và...",
        },
        {
          img: benh6,
          name: "Cảm lạnh",
          detail:
            "Cảm lạnh là một bệnh lý đường hô hấp do bị nhiễm virus gây ra cảm giác mệt mỏi kèm theo các triệu chứng ảnh hưởng tới cuộc sống hàng ngày...",
        },
        {
          img: benh7,
          name: "Đậu mùa khỉ",
          detail:
            "Bệnh đậu mùa khỉ là một bệnh hiếm gặp tương tự như bệnh đậu mùa, nguyên nhân do virus đậu mùa khỉ gây ra. Bệnh này thường gặp ở các khu vực...",
        },
        {
          img: benh8,
          name: "Cúm A H3N2",
          detail:
            "Virus cúm A H3N2 là một phân nhóm virus gây ra bệnh cúm. Ở chim, lợn và người, virus này biến đổi thành nhiều chủng khác nhau về mặt di truyền...",
        },
      ],
    },
    Meat: {
      title: "Bệnh theo đối tượng",
      products: [
        {
          img: benh9,
          name: "BỆNH NAM GIỚI",
          detail:
            "Loãng xương ở nam, Di tinh, mộng tinh, Hẹp bao quy đầu, Yếu sinh lý",
        },
        {
          img: benh10,
          name: "BỆNH NỮ GIỚI",
          detail:
            "Hội chứng tiền kinh nguyệt, Hội chứng tiền mãn kinh, Chậm kinh, Mất kinh",
        },
        {
          img: benh11,
          name: "BỆNH NGƯỜI GIÀ",
          detail:
            "Parkinson thứ phát, Alzheimer, Parkinson, Đục thủy tinh thể ở người già",
        },
        {
          img: benh12,
          name: "BỆNH TRẺ EM",
          detail: "Bại não trẻ em, Tự kỷ, Uốn ván, Tắc ruột sơ sinh",
        },
      ],
    },
  };

  const renderFeaturedProducts = (data) => {
    const tabList = [];
    const tabPanels = [];

    Object.keys(data).forEach((key, index) => {
      tabList.push(<Tab key={index}>{data[key].title}</Tab>);

      const tabPanel = [];
      data[key].products.forEach((item, j) => {
        tabPanel.push(
          <div className="col-lg-3" key={j}>
            <div className="featured_item">
              <div
                className="featured_item_pic"
                style={{
                  backgroundImage: `url(${item.img})`,
                }}
              ></div>
              <div className="featured_item_text">
                <h6>
                  <Link to="">{item.name}</Link>
                </h6>
                <h5>{item.detail}</h5>
              </div>
            </div>
          </div>
        );
      });
      tabPanels.push(tabPanel);
    });

    return (
      <Tabs>
        <TabList>{tabList}</TabList>
        {tabPanels.map((item, key) => (
          <TabPanel key={key}>
            <div className="row">{item}</div>
          </TabPanel>
        ))}
        ;
      </Tabs>
    );
  };

  return (
    <>
      <div className="slideshows">
        {/* Slideshow được đặt ở đây, trên phần tiêu đề "Sản phẩm bán chạy" */}
        <Slideshow images={slideshowImages} interval={3000} />
      </div>
      <div className="container">
        <div className="featured">
          <div className="section-title">
            <h2>Sản phẩm bán chạy</h2>
          </div>
          <div className="products">
            {products.map((product, index) => (
              <Link
                to={`/product/${product.id}`}
                key={index}
                style={{ textDecoration: "none" }}
              >
                <div key={index} className="product">
                  {product.price && product.price.phanTramGiamGia > 0 && (
                    <div className="discount">
                      - {product.price.phanTramGiamGia}%
                    </div>
                  )}
                  <img src={product.imageUrl[0]} alt={product.tenSanPham} />
                  <h3 className="product-name">{product.tenSanPham}</h3>
                  <div className="price">
                    <span className="current-price">
                      {formatter(product.price.giaTienHienTai)}
                    </span>
                    <span className="original-price">
                      {formatter(product.price.giaTienGoc)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-title">
            <h2>Bệnh</h2>
          </div>
          {renderFeaturedProducts(featProducts)}
        </div>
      </div>
    </>
  );
};

export default memo(HomePage);
