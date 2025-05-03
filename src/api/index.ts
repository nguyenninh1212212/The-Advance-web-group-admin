import axios from "axios";

const BASE_URL = "http://localhost:8080";
// Tạo một instance của axios
export const api = axios.create({
  baseURL: `${BASE_URL}`, // Địa chỉ API backend
  timeout: 5000, // Thời gian timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Để gửi cookie cùng yêu cầu
});

// Thêm interceptor cho yêu cầu
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Gắn token vào header Authorization
  }
  return config;
});

// Thêm interceptor cho phản hồi để xử lý khi token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử làm mới token
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;
      try {
        // Gửi yêu cầu làm mới token
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true } // Gửi cookie khi làm mới token
        );
        const newAccessToken = res.data.result.accessToken;
        localStorage.setItem("accessToken", newAccessToken); // Lưu token mới vào localStorage
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Cập nhật lại token cho yêu cầu gốc
        return api(originalRequest); // Tiến hành lại yêu cầu gốc với token mới
      } catch (refreshErr) {
        localStorage.removeItem("accessToken"); // Xóa token nếu làm mới thất bại
        window.location.href = "/auth/login"; // Chuyển hướng đến trang đăng nhập
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err); // Nếu không phải lỗi 401, reject promise với lỗi gốc
  }
);
