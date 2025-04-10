import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, ButtonGroup } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import fakedata from "../../fakedata.json"; // Import dữ liệu từ file local

const Dashboard = () => {
    const [data, setData] = useState<{ date: string; users: number; stories: number; transactions: number }[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]); // Không khởi tạo với data
    const [filter, setFilter] = useState("month");

    // Hàm lọc dữ liệu
    const filterData = (type: string) => {
        const groupedData = groupBy(type);
        setFilteredData(groupedData.map(item => ({ ...item, date: item.time })));
        setFilter(type);
    };

    useEffect(() => {
        if (fakedata.sales && Array.isArray(fakedata.sales)) {
            const reportData = fakedata.sales.map((item: any) => ({
                date: item.date,
                users: item.users,
                stories: item.stories,
                transactions: item.transactions,
            }));
            setData(reportData);
        } else {
            console.error("Dữ liệu 'sales' không tồn tại hoặc không đúng định dạng.");
        }
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            filterData(filter); // Gọi filterData khi data đã được cập nhật
        }
    }, [data]);

    // Hàm tạo dữ liệu mặc định (hiển thị giá trị 0 nếu không có dữ liệu)
    const generateDefaultData = (type: string) => {
        const now = new Date();
        const defaultData = [];

        if (type === "month") {
            // Tạo 12 tháng mặc định
            for (let i = 0; i < 12; i++) {
                defaultData.push({
                    time: `Tháng ${i + 1}`,
                    users: 0,
                    stories: 0,
                    transactions: 0,
                });
            }
        } else if (type === "quarter") {
            // Tạo 4 quý mặc định
            for (let i = 1; i <= 4; i++) {
                defaultData.push({
                    time: `Quý ${i}`,
                    users: 0,
                    stories: 0,
                    transactions: 0,
                });
            }
        } else if (type === "year") {
            // Tạo dữ liệu cho từng năm (ví dụ: 5 năm gần nhất)
            const startYear = now.getFullYear() - 4;
            for (let i = startYear; i <= now.getFullYear(); i++) {
                defaultData.push({
                    time: `${i}`,
                    users: 0,
                    stories: 0,
                    transactions: 0,
                });
            }
        }

        return defaultData;
    };

    // Hàm nhóm và điền dữ liệu mặc định
    const groupBy = (type: string) => {
        const groupedData = generateDefaultData(type); // Tạo dữ liệu mặc định

        data.forEach((item) => {
            const itemDate = new Date(item.date);
            let key = "";

            if (type === "month") {
                key = `Tháng ${itemDate.getMonth() + 1}`;
            } else if (type === "quarter") {
                const quarter = Math.floor(itemDate.getMonth() / 3) + 1;
                key = `Quý ${quarter}`;
            } else if (type === "year") {
                key = `${itemDate.getFullYear()}`;
            }

            // Tìm dữ liệu mặc định tương ứng để cộng dồn giá trị
            const existingGroup = groupedData.find((g) => g.time === key);
            if (existingGroup) {
                existingGroup.users += item.users;
                existingGroup.stories += item.stories;
                existingGroup.transactions += item.transactions;
            }
        });

        return groupedData;
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Báo cáo doanh số
                </Typography>
                {/* Nút lọc */}
                <ButtonGroup variant="contained" color="primary" style={{ marginBottom: "16px" }}>
                    <Button onClick={() => filterData("month")} disabled={filter === "month"}>
                        Theo tháng
                    </Button>
                    <Button onClick={() => filterData("quarter")} disabled={filter === "quarter"}>
                        Theo quý
                    </Button>
                    <Button onClick={() => filterData("year")} disabled={filter === "year"}>
                        Theo năm
                    </Button>
                </ButtonGroup>
                {/* Biểu đồ cho người dùng */}
                <Typography variant="h6" gutterBottom>
                    Người dùng mới
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" /> {/* Trục X hiển thị tháng, quý hoặc năm */}
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" name="Người dùng" />
                    </LineChart>
                </ResponsiveContainer>
                {/* Biểu đồ cho giao dịch */}
                <Typography variant="h6" gutterBottom>
                    Giao dịch trong hệ thống
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="transactions" stroke="#82ca9d" name="Giao dịch" />
                    </LineChart>
                </ResponsiveContainer>
                {/* Biểu đồ cho số lượng truyện */}
                <Typography variant="h6" gutterBottom>
                    Số lượng truyện được đăng tải
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="stories" stroke="#ffc658" name="Số lượng truyện" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default Dashboard;
