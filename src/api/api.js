import axios from "axios";

const API_BASE_URL = 'http://localhost/api';
const authToken = sessionStorage.getItem('accessToken');

const getAuthConfig = () => {    
    return {
      headers: {        
        'Content-Type': 'application/json'
      }
    };
  };

export const resetPasswordService = async (user) => {    
    try {
        const requestData = {
          data: {
            user_name: user,
          },
        };
            
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, requestData);
        return response.data;
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        throw error;
      }
}