import axios from "axios";
axios.defaults.baseURL = 'http://localhost/api'


const getAuthConfig = () => {
  const authToken = sessionStorage.getItem('accessToken');
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
    const config = {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
    const response = await axios.get(`/sanctum/csrf-cookie`, config)
    return response
  } catch (error) {
    console.error('Error fetching auth tokens:', error);

  }
}
/* Servicio para el Log-out */
export const fetchLogOut = async () => {
  try {
    const config = getAuthConfig()
    const response = await axios.post('/users/logout', null, config)
    return response
  } catch (error) {
    throw error
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
    const response = await axios.get('/tiposervicios');
    return response
  } catch (error) {
    console.error('Error fetching categorías:', error);
    throw error;
  }
}

export const getMagicTowns = async () => {
  try {
    const response = await axios.get('/pueblosmagicos');
    return response
  } catch (error) {
    console.error('Error fetching pueblos mágicos:', error);
    throw error;
  }
}

export const getStateCatalogue = async () => {
  try {
    const response = await axios.get('/catestados');
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
    const response = await axios.post('/servicios/registrar', datos, config)
    return response
  } catch (error) {
    throw error
  }
}
/* Servicios para recuperar contraseña */
export const forgotPasswordService = async (user) => {
  try {
    const requestData = {
      data: {
        user_name: user,
      },
    };

    const response = await axios.post('/forgot-password', requestData);
    return response.data;
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    throw error;
  }
}
export const resetPasswordService = async (data) => {
  try {
    const response = await axios.post('/password/reset', data);
    return response.data
  } catch (error) {
    throw error
  }
}

/* Servicios para filtrar solicitudes (Todas, Aceptadas, Pendientes, Con observación) */
export const getAllServices = async (page) => {
  try {
    const config = {
      ...getAuthConfig(),
      params: {
        page: page + 1
      }
    };
    const response = await axios.get('/servicios', config)
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
    const response = await axios.get(`/servicios/filtrar/estatus/${id_status}`, config)
    return response.data
  } catch (error) {
    throw error
  }
}

/* Servicio para aceptar una solicitud */

export const fetchAccept = async (id_service, data) => {
  try {
    const config = getRequestConfig({
      '_method': 'put',
      'Content-Type': 'application/json'
    })
    const response = await axios.put(`/servicios/${id_service}`, data, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para observaciones */
export const fetchObservations = async (data) => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    })
    const response = await axios.post('/observaciones', data, config)
    return response
  } catch (error) {
    throw error
  }
}
/* Servicios para obtener usuarios */

export const fetchTipoUsuario = async () => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    })
    const response = await axios.get('/users', config)
    return response
  } catch (error) {
    throw error
  }
}

export const fetchTipoUsuarioById = async (id) => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    })
    const response = await axios.get(`/users/${id}`, config)
    return response
  } catch (error) {
    throw error
  }
}
/* Servicio para obtener tipos de usuario*/

export const fetchTypeUsers = async () => {
  try {
    const header = {
      'accept': 'application/json'
    }
    const response = await axios.get('/cattiposUsers', header)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para obtener un usuario con su ID */

export const fetchUpdateRole = async (id, data) => {
  try {
    const config = getRequestConfig({
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    })
    const response = await axios.post(`/users/${id}`, data, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para filtrar usuarios */

export const fetchGetFilteredUsers = async (filtros, page) => {
  try {
    const config = {
      ...getAuthConfig(),
      params: {
        page: page + 1
      }
    };
    const paramsURL = new URLSearchParams({
      tipoUser: filtros.tipoUser,
      conTuristas: filtros.conTuristas,
      estatusUser: filtros.estatusUser,
      buscar: filtros.buscar
    });

    const response = await axios.get(`/users/buscador/user?${paramsURL.toString()}`, config);
    return response
  } catch (error) {
    throw error
  }
}