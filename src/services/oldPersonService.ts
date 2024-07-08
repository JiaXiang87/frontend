import axios from 'axios';

const API_URL = 'http://47.102.213.168:8080';

const getToken = () => {
  return localStorage.getItem('token');
}

export const getOldPersons = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/oldpersons`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching old persons:', error);
    throw error;
  }
};

export const getOldPersonsCount = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/oldpersons/count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching old persons:', error);
    throw error;
  }
};

export const deleteOldPerson = async (id: number) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/oldpersons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error deleting old person:', error);
    throw error;
  }
};

export const addOldPerson = async (person: any) => {
  try {
    console.log(person);
    const token = getToken();
    const response = await axios.post(`${API_URL}/oldpersons`, person, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding old person:', error);
    throw error;
  }
};

export const updateOldPerson = async (id: number, person: any) => {
  try {
    const token = getToken();
    const response = await axios.put(`${API_URL}/oldpersons/${id}`, person, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating old person:', error);
    throw error;
  }
};
