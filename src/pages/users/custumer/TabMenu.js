import React, { useState, useEffect } from "react";
import "./VerticalTabMenu.css";
import UserScreen from "./UserScreen";
import CardScreen from "./CartScreen";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TabMenu() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [userName, setUserName] = useState("User Name");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const email = sessionStorage.getItem("email");
      if (!token || !email) {
        console.error("Authentication data not found");
        return;
      }
      const response = await axios.get(
        `http://localhost:5002/api/customer?Email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { firstName, lastName } = response.data.data;
      if (firstName && lastName) {
        setUserName(`${firstName} ${lastName}`);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === "Logout") {
      handleLogout();
      console.log("Đăng xuất");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="personal">
      <div className="vertical-tab-menu">
        <div className="header-tab-container">
          <div className="header">
            <div className="profile-info">
              <img
                src="https://th.bing.com/th/id/OIP.KdRE7KHqL-46M8nrvOX2CgAAAA?rs=1&pid=ImgDetMain"
                className="avatar"
                alt="Avatar"
              />
              <span className="name">{userName}</span>
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
            {/* <button
              className={
                activeTab === "Logout" ? "tablinks active" : "tablinks"
              }
              onClick={() => handleTabClick("Logout")}
            >
              Đăng xuất
            </button> */}
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
