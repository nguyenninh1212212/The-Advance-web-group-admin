import { api } from "./index";

interface StatisticsRequest {
  filter: "month" | "quarter" | "year";
  selectedYear?: number;
}

interface StatisticsResponse {
  code: number;
  message: string;
  result: {
    periodLabel: string;
    newUsers: number;
    newStories: number;
    transactionCount: number;
  }[];
}

export const getStatistics = async (
  request: StatisticsRequest
): Promise<StatisticsResponse> => {
  const response = await api.get<StatisticsResponse>("/admin/statistics", {
    params: request,
    withCredentials: true,
  });
  return response.data;
};