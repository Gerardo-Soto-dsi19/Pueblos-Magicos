import axios from "axios";
axios.defaults.baseURL = 'http://localhost/api'
const API_BASE_URL = 'http://localhost/api';
const authToken = sessionStorage.getItem('accessToken');

const getAuthConfig = () => {
  return {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    }
  };
};

const getRequestConfig = (additionalHeaders = {}) => {
  const authConfig = getAuthConfig();
  return {
    ...authConfig,
    headers: {
      ...authConfig.headers,
      ...additionalHeaders
    }
  };
};

/* Servicios para el login */
export const loginUser = async (data) => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    })
    const response = await axios.post('/users/login', data, config)
    return response
  } catch (error) {
    throw error
  }
}

export const fetchAuthTokens = async () => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    })
    const response = await axios.get(`/sanctum/csrf-cookie`, config)

  } catch (error) {
    console.error('Error fetching auth tokens:', error);

  }
}
/* Servicios para registrar usuarios */
export const createUser = async (data) => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    });
    const response = await axios.post('/users/registrar', data, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicios para el Formulario*/
export const getTypesServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tiposervicios`);
    return response
  } catch (error) {
    console.error('Error fetching categorías:', error);
    throw error;
  }
}

export const getMagicTowns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pueblosmagicos`);
    return response
  } catch (error) {
    console.error('Error fetching pueblos mágicos:', error);
    throw error;
  }
}

export const getStateCatalogue = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/catestados`);
    return response
  } catch (error) {
    console.error('Error fetching estados:', error);
    throw error;
  }
}

export const createService = async (datos) => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    })
    const response = await axios.post(`${API_BASE_URL}/servicios/registrar`, datos, config)
    return response
  } catch (error) {
    throw error
  }
}

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
export const getAllServices = async (page) => {
  try {
    const config = {
      ...getAuthConfig(),
      params: {
        page: page + 1
      }
    };
    const response = await axios.get(`${API_BASE_URL}/servicios`, config)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getServicesFiltered = async (id_status, page) => {
  try {
    const config = {
      ...getAuthConfig(),
      params: {
        page: page + 1
      }
    };
    const response = await axios.get(`${API_BASE_URL}/servicios/filtrar/estatus/${id_estatus}`, config)
    return response.data
  } catch (error) {
    throw error
  }
}