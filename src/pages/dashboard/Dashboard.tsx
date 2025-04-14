import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, ButtonGroup } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const [data, setData] = useState<{ date: string; users: number; stories: number; transactions: number }[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [filter, setFilter] = useState("month");

    // Hàm gọi API để lấy dữ liệu
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:8080/admin/sales", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Dữ liệu từ API:", result);
                if (result && Array.isArray(result.data)) {
                    const reportData = result.data.map((item: any) => ({
                        date: item.date,
                        users: item.users,
                        stories: item.stories,
                        transactions: item.transactions,
                    }));
                    setData(reportData);
                } else {
                    console.error("Dữ liệu 'sales' không tồn tại hoặc không đúng định dạng.");
                }
            } else {
                console.error("Lỗi khi gọi API:", response.statusText);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Gọi API khi component được mount
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            filterData(filter); // Gọi filterData khi data đã được cập nhật
        }
    }, [data]);

    const filterData = (type: string) => {
        const groupedData = groupBy(type);
        setFilteredData(groupedData.map((item) => ({ ...item, date: item.time })));
        setFilter(type);
    };

    const generateDefaultData = (type: string) => {
        const now = new Date();
        const defaultData = [];

        if (type === "month") {
            for (let i = 0; i < 12; i++) {
                defaultData.push({
                    time: `Tháng ${i + 1}`,
                    users: 0,
                    stories: 0,
                    transactions: 0,
                });
            }
        } else if (type === "quarter") {
            for (let i = 1; i <= 4; i++) {
                defaultData.push({
                    time: `Quý ${i}`,
                    users: 0,
                    stories: 0,
                    transactions: 0,
                });
            }
        } else if (type === "year") {
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

    const groupBy = (type: string) => {
        const groupedData = generateDefaultData(type);

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
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" name="Người dùng" />
                        <Line type="monotone" dataKey="stories" stroke="#82ca9d" name="Truyện được thêm" />
                        <Line type="monotone" dataKey="transactions" stroke="#ffc658" name="Giao dịch" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default Dashboard;
