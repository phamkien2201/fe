import { memo} from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";

const Footer = () => {

    return (
    <footer className="footer">
        <div className="container">
            <div className="footer-row">
                <div className="col-lg-3 col-md-6 ">
                    <div className="footer_about">
                        <h1 className="footer_about_logo">Medicine Shopping App</h1>
                        <ul>
                            <li>Địa chỉ: 999 Hai Bà Trưng </li>
                            <li>Phone: 0843438487</li>
                            <li>Email: medicineshop@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 ">
                    <div className="footer_widget">
                        <h6>Cửa hàng</h6>
                        <ul>
                            <li>
                                <Link to="">Liên hệ</Link>
                            </li>
                            <li>
                                <Link to="">Thông tin về chúng tôi</Link>
                            </li>
                            <li>
                                <Link to="">Sản phẩm kinh doanh</Link>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <Link to="">Thông tin tài khoản</Link>
                            </li>
                            <li>
                                <Link to="">Giỏ hàng</Link>
                            </li>
                            <li>
                                <Link to="">Danh sách ưu thích</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-3 col-md-12 ">
                    <div className="footer_widget">
                        <h6>Tổng đài</h6>
                        <p>0843438487</p>
                        <h6>Tư vấn mua hàng</h6>
                        <p>0843438487</p>
                        <h6>Kết nối với chúng tôi</h6>
                        <div className="footer_widget_social">
                            <div>
                                <BsFacebook />
                            </div>
                            <div>
                            <AiFillInstagram />
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>


    </footer>
    );
};

export default memo(Footer);