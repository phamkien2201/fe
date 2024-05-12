import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import useAPIInterceptor from "./apiInterceptor";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useAPIInterceptor();
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("email");
    if (loggedInUser) {
      setEmail(loggedInUser); // Sử dụng email từ sessionStorage để hiển thị địa chỉ email người đăng nhập
    }
  }, []);

  const validate = () => {
    let result = true;
    // Biểu thức chính quy để kiểm tra tính hợp lệ của email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "" || email === null) {
      result = false;
      toast.warning("Nhập Email");
    } else if (!emailRegex.test(email)) {
      result = false;
      toast.warning("Email không hợp lệ");
    }

    if (password === "" || password === null) {
      result = false;
      toast.warning("Nhập mật khẩu");
    }
    return result;
  };

  const proceedLoginUsingAPI = (e) => {
    e.preventDefault();
    if (validate()) {
      const inputObj = { email, password };
      fetch("http://localhost:5004/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(inputObj),
      })
        .then((res) => res.json())
        .then((resp) => {
          console.log(resp);
          if (resp.succeeded === false) {
            toast.error("Đăng nhập thất bại, thông tin không hợp lệ");
          } else {
            // Log access token và refresh token vào console
            console.log("Access Token:", resp.data.accessToken);
            console.log("Refresh Token:", resp.data.refreshToken);

            toast.success("Đăng nhập thành công");
            sessionStorage.setItem("email", email); // Lưu email vào sessionStorage
            sessionStorage.setItem("accessToken", resp.data.accessToken);
            sessionStorage.setItem("refreshToken", resp.data.refreshToken);
            navigate("/cart"); // Chuyển hướng đến trang giỏ hàng
          }
        })

        .catch((err) => {
          toast.error("Đăng nhập thất bại do: " + err.message);
        });
    }
  };

  return (
    <div className="khung-login">
      <form onSubmit={proceedLoginUsingAPI} className="container-login">
        <div className="card">
          <div className="card-header">
            <h2>Đăng nhập</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>
                Email <span className="errmsg">*</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control-login"
              ></input>
            </div>
            <div className="form-group">
              <label>
                Password <span className="errmsg">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control-login"
              ></input>
              <button type="submit" className="btn btn-primary">
                Đăng nhập
              </button>
            </div>
          </div>
          <div className="card-footer">
            <Link className="btn btn-success" to={"/register"}>
              Đăng ký
            </Link>
          </div>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;