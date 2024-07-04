import axios from 'axios';

const API_URL = 'http://47.102.213.168:8080';  // 服务器地址

const getToken = () => {
  return localStorage.getItem('token');  // 从本地存储获取token
};

// 获取所有任务
export const getAllTasks = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('获取任务失败:', error);
    throw error;
  }
};

// 创建任务
export const createTask = async (data: any) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/tasks`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('创建任务失败:', error);
    throw error;
  }
};

// 更新任务
export const updateTask = async (id: number, data: any) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/tasks/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('更新任务失败:', error);
    throw error;
  }
};

// 删除任务
export const deleteTask = async (id: number) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除任务失败:', error);
    throw error;
  }
};
