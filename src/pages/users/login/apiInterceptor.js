import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAPIInterceptor = () => {
  const [refreshingToken, setRefreshingToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        console.log("Interceptor: Response success", response);
        return response; // Trả về phản hồi nếu thành công
      },
      async (error) => {
        console.log("Interceptor: Response error", error);
        if (
          error.response &&
          error.response.status === 401 &&
          !error.config._retry
        ) {
          // Xử lý khi token hết hạn
          error.config._retry = true;
          if (!refreshingToken) {
            setRefreshingToken(true);
            try {
              // Gọi API để refresh token
              const refreshResponse = await axios.post(
                "http://localhost:5004/api/auth/refresh-token",
                {
                  refreshToken: sessionStorage.getItem("refreshToken"),
                }
              );
              const newAccessToken = refreshResponse.data.accessToken;
              // Lưu token mới vào sessionStorage
              sessionStorage.setItem("accessToken", newAccessToken);
              // Thực hiện lại yêu cầu ban đầu với token mới
              error.config.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(error.config);
            } catch (refreshError) {
              // Xử lý lỗi refresh token
              console.error("Error refreshing token:", refreshError);
              navigate("/logout"); // Đăng xuất người dùng nếu refresh token hết hạn
              return Promise.reject(refreshError);
            } finally {
              setRefreshingToken(false);
            }
          }
        }
        return Promise.reject(error); // Trả về lỗi nếu không phải là lỗi token hết hạn
      }
    );

    return () => {
      // Cleanup interceptor khi component unmount
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate, refreshingToken]);

  return null;
};

export default useAPIInterceptor;
