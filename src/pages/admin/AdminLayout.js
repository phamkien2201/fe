import React from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <div
        className="admin-header"
        style={{
          background: "#306de4",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ color: "#ffffff", margin: "0", paddingLeft: "20px" }}>
          Medicine Shopping App
        </h1>
        <div className="admin-logout" style={{ paddingRight: "20px" }}>
          <button className="logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdminLayout;
