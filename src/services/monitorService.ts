import axios from 'axios';

const API_URL = 'http://47.102.213.168:8080';

const getToken = () => {
  return localStorage.getItem('token');
}

// 获取所有视频监控
export const getAllVideoMonitors = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/video_monitors`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取视频监控失败:', error);
    throw error;
  }
};

// 创建视频监控
export const createVideoMonitor = async (data: any) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/video_monitors`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('创建视频监控失败:', error);
    throw error;
  }
};

// 删除视频监控
export const deleteVideoMonitor = async (id: number) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/video_monitors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('删除视频监控失败:', error);
    throw error;
  }
};
