import axios from 'axios';

const API_URL = 'http://47.102.213.168:8080';

export interface LoginResponse {
  email: string;
  id: number;
  realName: string;
  token: string;
  username: string;
}

export const apiLogin = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/admin/login`, {
    username,
    password
  });
  return response.data;
};

export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting userInfo:', error);
    throw error;
  }
};
