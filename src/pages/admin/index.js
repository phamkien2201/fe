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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Access token is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5003/api/admin-order/get-all-order",
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
          fetchCustomerEmails(data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        toast.error("Error: " + error.message);
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
              `Failed to fetch email for customer ID: ${order.customerId}`
            );
          }
        } catch (error) {
          toast.error("Error: " + error.message);
        }
      }

      setCustomerEmails(emails);
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Access token is missing. Please log in again.");
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
        toast.error("Invalid status");
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
        toast.success(`Order ${status} successfully`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        toast.error(data.message || `Failed to update order to ${status}`);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/admin/order-details/${orderId}`);
  };

  return (
    <div className="admin-container">
      <h2>Admin Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Email</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
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
              <td>{customerEmails[order.customerId] || "Loading..."}</td>
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
                        Confirm
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "COMPLETE")}
                        disabled={order.status === "CANCELLED"}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                        disabled={
                          order.status === "COMPLETE" ||
                          order.status === "CONFIRMED"
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Admin;
