import axios from 'axios';

export const apiRequest = async (baseURL, method, endpoint, data = {}, headers = {}) => {
  try {
    const response = await axios({
      method,
      url: `${baseURL}${endpoint}`,
      data,
      headers
    });
    return response;
  } catch (error) {
    throw error;
  }
};
