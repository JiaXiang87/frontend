import axios from 'axios';

const API_URL = 'http://47.102.213.168:8080';

const getToken = () => {
  return localStorage.getItem('token');
}

export const getEmployees = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/employees`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: number) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error deleting employees:', error);
    throw error;
  }
};

export const addEmployee = async (person: any) => {
  try {
    console.log(person);
    const token = getToken();
    const response = await axios.post(`${API_URL}/employees`, person, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding employees:', error);
    throw error;
  }
};

export const updateEmployee = async (id: number, person: any) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/employees/${id}`, person, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating employees:', error);
    throw error;
  }
};
