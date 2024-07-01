import axios from 'axios';

const API_URL = 'http://47.102.213.168:8080';

const getToken = () => {
  return localStorage.getItem('token');
};

// 获取所有事件
export const getEvents = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/events`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// 搜索事件
export const searchEvents = async (query: string) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/events/search`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

// 删除事件
export const deleteEvent = async (id: number) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// 创建事件
export const createEvent = async (eventData: any) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/events`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};
