import { api } from "./index";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  code: number;
  message: string;
  result: {
    accessToken: string;
    role: string[];
  };
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/token", credentials, {
    withCredentials: true,
  });
  return response.data;
};
