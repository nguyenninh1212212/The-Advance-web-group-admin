import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, ButtonGroup, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MenuProps } from "@mui/material";



const Dashboard = () => {
    const [data, setData] = useState<{ date: string; users: number; stories: number; transactions: number }[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [filter, setFilter] = useState("month");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [startYear, setStartYear] = useState(new Date().getFullYear() - 4);

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
                    filterData(filter); // Gọi filterData ngay sau khi dữ liệu được tải
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

    useEffect(() => {
        if (filter === "month" || filter === "quarter" || filter === "year") {
            filterData(filter); // Gọi filterData khi filter, selectedYear, hoặc startYear thay đổi
        }
    }, [filter, selectedYear, startYear]);

    const filterData = (type: string) => {
        const groupedData = groupBy(type);
        setFilteredData(groupedData.map((item) => ({ ...item, date: item.time })));
        setFilter(type);
    };

    const handleYearChange = (e: any) => {
        const newStartYear = Number(e.target.value);
        setStartYear(newStartYear); // Cập nhật startYear thay vì selectedYear
        filterData(filter); // Gọi lại filterData để cập nhật biểu đồ
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
                if (itemDate.getFullYear() === selectedYear) {
                    key = `Tháng ${itemDate.getMonth() + 1}`;
                }
            } else if (type === "quarter") {
                if (itemDate.getFullYear() === selectedYear) {
                    const quarter = Math.floor(itemDate.getMonth() / 3) + 1;
                    key = `Quý ${quarter}`;
                }
            } else if (type === "year") {
                if (itemDate.getFullYear() >= startYear) {
                    key = `${itemDate.getFullYear()}`;
                }
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
                {(filter === "month" || filter === "quarter") && (
                    <FormControl style={{ marginBottom: "16px", minWidth: 120 }}>
                        <InputLabel>Năm</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Giới hạn chiều cao tối đa
                                        overflowY: "auto", // Thêm thanh cuộn nếu vượt quá chiều cao
                                    },
                                },
                            }}
                        >
                            {Array.from({ length: 10 }, (_, i) => (
                                <MenuItem key={i} value={new Date().getFullYear() - i}>
                                    {new Date().getFullYear() - i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                )}
                {filter === "year" && (
                    <FormControl style={{ marginBottom: "16px", minWidth: 120 }}>
                        <InputLabel>Năm bắt đầu</InputLabel>
                        <Select
                            value={startYear}
                            onChange={handleYearChange} // Sử dụng hàm handleYearChange
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // Giới hạn chiều cao tối đa
                                        overflowY: "auto", // Thêm thanh cuộn nếu vượt quá chiều cao
                                    },
                                },
                            }}
                        >
                            {Array.from({ length: 10 }, (_, i) => (
                                <MenuItem key={i} value={new Date().getFullYear() - i}>
                                    {new Date().getFullYear() - i}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                )}
                <ResponsiveContainer width="100%" height={400}>
                    {filteredData.length > 0 ? (
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
                    ) : (
                        <Typography variant="body1" align="center">
                            Không có dữ liệu để hiển thị
                        </Typography>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default Dashboard;
