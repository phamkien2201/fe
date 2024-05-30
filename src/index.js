import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouterCustom from "./router";
import "./style/style.scss";
import Admin from "./pages/admin/index";
import OrderDetails from "./pages/admin/OrderDetails";
import AdminLayout from "./pages/admin/AdminLayout";

const App = () => {
  //const isAdmin = window.location.pathname.startsWith("/admin");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Admin />} />
                <Route
                  path="order-details/:orderId"
                  element={<OrderDetails />}
                />
              </Routes>
            </AdminLayout>
          }
        />
        <Route path="*" element={<RouterCustom />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
