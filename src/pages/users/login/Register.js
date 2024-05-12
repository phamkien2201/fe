import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const [email, emailchange] = useState("");
  const [password, passwordchange] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const IsValidate = () => {
    if (email === null || email === "") {
      toast.error("Vui lòng nhập email.");
      return false;
    }

    if (password === null || password === "") {
      toast.error("Vui lòng nhập mật khẩu.");
      return false;
    }

    if (confirmPassword.trim() === "") {
      toast.error("Vui lòng xác nhận mật khẩu.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu phải giống nhau.");
      return false;
    }

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }

    return true;
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    let regobj = { email, password };
    if (IsValidate()) {
      fetch("http://localhost:5004/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(regobj),
      })
        .then((res) => {
          if (res.status === 409) {
            // Kiểm tra nếu tài khoản đã tồn tại
            throw new Error("Tài khoản đã tồn tại."); // Ném lỗi để bắt trong catch
          }
          if (!res.ok) {
            // Kiểm tra nếu có lỗi không xác định
            throw new Error("Có lỗi xảy ra khi đăng ký."); // Ném lỗi để bắt trong catch
          }
          toast.success("Đăng ký thành công.");
          navigate("/login");
        })
        .catch((err) => {
          toast.error("Failed: " + err.message);
        });
    } else {
      toast.error("Email và mật khẩu không hợp lệ!");
    }
  };

  return (
    <div>
      <div className="khung-register">
        <form className="container-Register" onSubmit={handlesubmit}>
          <div className="card">
            <div className="card-header">
              <h1>Đăng ký</h1>
            </div>
            <div className="card-body">
              <div className="row-Register">
                <div className="col-lg-Reister">
                  <div className="form-group">
                    <label>
                      Email <span className="errmsg">*</span>
                    </label>
                    <input
                      value={email}
                      onChange={(e) => emailchange(e.target.value)}
                      className="form-control"
                    ></input>
                  </div>
                </div>
                <div className="col-lg-Reister">
                  <div className="form-group">
                    <label>
                      Password <span className="errmsg">*</span>
                    </label>
                    <input
                      value={password}
                      onChange={(e) => passwordchange(e.target.value)}
                      type="password"
                      className="form-control"
                    ></input>
                    <div className="form-group-cp">
                      <label>
                        Confirm Password <span className="errmsg">*</span>
                      </label>
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        className="form-control"
                      ></input>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Đăng ký
                    </button>
                  </div>
                </div>
                <ToastContainer />
              </div>
            </div>
            <div className="card-footer">
              <Link to={"/login"} className="btn btn-danger">
                Đóng
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
