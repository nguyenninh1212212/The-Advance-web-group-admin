import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";
import { login } from "../../api/login";
import { toast } from "react-toastify";

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
    const navigate = useNavigate();

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            const response = await login(data);
            console.log("Response:", response); // In ra phản hồi từ API để kiểm tra
            // Kiểm tra phản hồi từ API
            if (response?.result?.accessToken) {
                console.log("Token:", response.result.accessToken); // In ra token để kiểm tra
                // Lưu token và role vào localStorage
                localStorage.setItem("token", response.result.accessToken);
                localStorage.setItem("role", JSON.stringify(response.result.role));

                // Chuyển hướng đến trang dashboard
                navigate("/");
            }
            else {
                toast.error("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.");
            }
        } catch (error: any) {
            toast.error(error.response.data.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.");
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
