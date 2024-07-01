import axios from 'axios';

const API_URL = 'http://47.102.213.168:8080';

const getToken = () => {
  return localStorage.getItem('token');
}

export const getVolunteers = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/volunteers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    throw error;
  }
};

export const deleteVolunteer = async (id: number) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/volunteers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    throw error;
  }
};

export const addVolunteer = async (person: any) => {
  try {
    console.log(person);
    const token = getToken();
    const response = await axios.post(`${API_URL}/volunteers`, person, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding volunteer:', error);
    throw error;
  }
};

export const updateVolunteer = async (id: number, person: any) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/volunteers/${id}`, person, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating volunteer:', error);
    throw error;
  }
};
