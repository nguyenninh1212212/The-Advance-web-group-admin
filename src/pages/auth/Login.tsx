import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
    const navigate = useNavigate();

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            
            const response = await fetch("http://localhost:8080/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), // Gửi đúng cấu trúc { email, password }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.code === 1000 && result.result.accessToken) {
                    // Lưu accessToken vào localStorage
                    localStorage.setItem("accessToken", result.result.accessToken);

                    // Kiểm tra vai trò (role) của người dùng
                    if (result.result.role.includes("ADMIN")) {
                        navigate("/"); // Điều hướng về trang chính nếu là admin
                    } else {
                        alert("Bạn không có quyền truy cập.");
                    }
                } else {
                    alert("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.");
                }
                console.log("Đang gửi yêu cầu đăng nhập với dữ liệu:", result.result.accessToken);
            } else {
                const errorMessage = await response.text();
                console.error("Đăng nhập thất bại:", errorMessage);
                alert("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.");
            }
             // Kiểm tra dữ liệu gửi đi
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    return (
        <Card style={{ maxWidth: 400, margin: "50px auto", padding: "20px" }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Đăng nhập Admin
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        {...register("email", {
                            required: "Email là bắt buộc",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Email không hợp lệ"
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register("password", { required: "Mật khẩu là bắt buộc" })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Đăng nhập
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default Login;