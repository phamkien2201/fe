import React, { useState } from "react";
import "./VerticalTabMenu.css";
import UserScreen from "./UserScreen";
import CardScreen from "./CartScreen";
import { useNavigate } from "react-router-dom";

function TabMenu() {
  const [activeTab, setActiveTab] = useState("Profile");

  const navigate = useNavigate();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "Logout") {
      handleLogout();
      console.log("Đăng xuất");
    }
  };
  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi sessionStorage
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userData"); // Xóa thông tin người dùng
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    // Chuyển hướng người dùng về trang đăng nhập
    navigate("/login");
  };

  return (
    <div className="personal">
      <div className="vertical-tab-menu">
        {/* Header and Tab */}
        <div className="header-tab-container">
          <div className="header">
            <div className="profile-info">
              <img
                src="https://th.bing.com/th/id/OIP.KdRE7KHqL-46M8nrvOX2CgAAAA?rs=1&pid=ImgDetMain"
                className="avatar"
                alt="Avatar"
              />
              <span className="name">User Name</span>
            </div>
          </div>

          <div className="tab">
            <button
              className={
                activeTab === "Profile" ? "tablinks active" : "tablinks"
              }
              onClick={() => handleTabClick("Profile")}
            >
              Profile
            </button>
            <button
              className={activeTab === "Cart" ? "tablinks active" : "tablinks"}
              onClick={() => handleTabClick("Cart")}
            >
              Cart
            </button>
            <button
              className={
                activeTab === "Logout" ? "tablinks active" : "tablinks"
              }
              onClick={() => handleTabClick("Logout")}
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div style={{ display: activeTab === "Profile" ? "block" : "none" }}>
            <UserScreen />
          </div>
          <div
            className="tabcontent"
            style={{ display: activeTab === "Cart" ? "block" : "none" }}
          >
            <CardScreen />
          </div>

          <div
            className="tabcontent"
            style={{ display: activeTab === "Logout" ? "block" : "none" }}
            onClick={() => handleTabClick("Logout")}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default TabMenu;
