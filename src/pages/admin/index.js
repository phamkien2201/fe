import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import "./admin.scss";
import { formatter } from "../../utils/formater";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [customerEmails, setCustomerEmails] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [pageIndex, pageSize]);

  const fetchOrders = async () => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Thiếu mã truy cập. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5003/api/admin-order/get-all-order?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.succeeded) {
        setOrders(data.data);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
        fetchCustomerEmails(data.data);
      } else {
        toast.error("Không thể lấy danh sách đơn hàng");
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const fetchCustomerEmails = async (orders) => {
    const emails = {};
    const accessToken = sessionStorage.getItem("accessToken");

    for (const order of orders) {
      if (!order.customerId) continue;

      try {
        const response = await fetch(
          `http://localhost:5002/api/customer/customerId?customerId=${order.customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (data.succeeded) {
          emails[order.customerId] = data.data.email;
        } else {
          toast.error(
            `Không thể lấy email cho khách hàng ID: ${order.customerId}`
          );
        }
      } catch (error) {
        toast.error("Lỗi: " + error.message);
      }
    }

    setCustomerEmails(emails);
  };

  const updateOrderStatus = async (orderId, status) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Thiếu mã truy cập. Vui lòng đăng nhập lại.");
      return;
    }

    let apiUrl = "";
    switch (status) {
      case "CONFIRMED":
        apiUrl = `http://localhost:5003/api/admin-order/update-order/${orderId}/confirmed`;
        break;
      case "COMPLETE":
        apiUrl = `http://localhost:5003/api/admin-order/update-order/${orderId}/completed`;
        break;
      case "CANCELLED":
        apiUrl = `http://localhost:5003/api/admin-order/update-order/${orderId}/cancelled`;
        break;
      default:
        toast.error("Trạng thái không hợp lệ");
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Cập nhật trạng thái đơn hàng thành công: ${status}`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        toast.error(data.message || `Cập nhật đơn hàng thất bại: ${status}`);
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/admin/order-details/${orderId}`);
  };

  const handlePageChange = (pageIndex) => {
    setPageIndex(pageIndex);
  };

  return (
    <div className="admin-container">
      <h2>Đơn hàng Quản trị</h2>
      <div className="pagination-input">
        <input
          type="number"
          value={pageIndex}
          onChange={(e) => setPageIndex(parseInt(e.target.value))}
        />
        <input
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
        />
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>ID Đơn hàng</th>
            <th>Email</th>
            <th>Tổng giá</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <button
                  className="link-button"
                  onClick={() => handleOrderClick(order.id)}
                >
                  {order.id}
                </button>
              </td>
              <td>{customerEmails[order.customerId] || "Đang tải..."}</td>
              <td>{formatter(order.totalPrice)}</td>
              <td>{order.status}</td>
              <td>
                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm:ss")}
              </td>
              <td>
                {order.status !== "COMPLETE" &&
                  order.status !== "CANCELLED" && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                        disabled={order.status !== "PENDING"}
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "COMPLETE")}
                        disabled={order.status === "CANCELLED"}
                      >
                        Hoàn thành
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                        disabled={
                          order.status === "COMPLETE" ||
                          order.status === "CONFIRMED"
                        }
                      >
                        Hủy
                      </button>
                    </>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-order">
        {totalPages > 1 && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={pageIndex === 1}
          >
            1
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => {
              if (pageIndex !== index + 1) {
                handlePageChange(index + 1);
              }
            }}
            className={pageIndex === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Admin;
