import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, ButtonGroup, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getStatistics } from "../../api/getStatistics";

const Dashboard = () => {
  const [data, setData] = useState<{ periodLabel: string; newUsers: number; newStories: number; transactionCount: number }[]>([]);
  const [filter, setFilter] = useState<"month" | "quarter" | "year">("month");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API để lấy dữ liệu
  const fetchData = async (filterType: "month" | "quarter" | "year") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStatistics({
        filter: filterType,
        selectedYear: selectedYear, // Truyền năm cho tất cả các bộ lọc
      });

      if (response) {
        console.log("Dữ liệu từ API:", response);
        setData(
          response.result.map((item) => ({
            periodLabel: item.periodLabel,
            newUsers: item.newUsers,
            newStories: item.newStories,
            transactionCount: item.transactionCount,
          }))
        );
      } else {
        setError("Không nhận được dữ liệu từ API.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setError("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter); // Gọi API khi component được mount hoặc khi filter/selectedYear thay đổi
  }, [filter, selectedYear]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Báo cáo doanh số
        </Typography>
        <ButtonGroup variant="contained" color="primary" style={{ marginBottom: "16px" }}>
          <Button onClick={() => setFilter("month")} disabled={filter === "month"}>
            Theo tháng
          </Button>
          <Button onClick={() => setFilter("quarter")} disabled={filter === "quarter"}>
            Theo quý
          </Button>
          <Button onClick={() => setFilter("year")} disabled={filter === "year"}>
            Theo năm
          </Button>
        </ButtonGroup>

        <FormControl style={{ marginBottom: "16px", minWidth: 120 }}>
          <InputLabel>Năm</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ResponsiveContainer width="100%" height={400}>
          {isLoading ? (
            <Typography variant="body1" align="center">
              Đang tải dữ liệu...
            </Typography>
          ) : error ? (
            <Typography variant="body1" align="center" color="error">
              {error}
            </Typography>
          ) : data.length > 0 ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodLabel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="Người dùng mới" />
              <Line type="monotone" dataKey="newStories" stroke="#82ca9d" name="Truyện mới" />
              <Line type="monotone" dataKey="transactionCount" stroke="#ffc658" name="Giao dịch" />
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
