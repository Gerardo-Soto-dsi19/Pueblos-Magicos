import { data } from "autoprefixer";
import axios from "axios";
axios.defaults.baseURL = 'http://localhost/api'
//axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      sessionStorage.removeItem('accessToken'); // Eliminar el token

      // Limpiar la cookie de Sanctum
      document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Guardar la URL actual
      sessionStorage.setItem('lastVisitedUrl', window.location.pathname);

      // Redirigir al login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
)

const getAuthConfig = () => {
  const authToken = sessionStorage.getItem('accessToken');
  if (authToken) {
    return {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    };
  }
  return {};
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
      'Content-Type': 'application/json',
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
    return response
  } catch (error) {
    throw error
  }
}

export const getServicesFiltered = async (id, page) => {
  try {
    const config = {
      ...getAuthConfig(),
      params: {
        page: page + 1
      }
    };
    const response = await axios.get(`/servicios/filtrar/estatus/${id}`, config)
    return response
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
    const config = getRequestConfig({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
    const response = await axios.get('/cattiposUsers', config)
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

/* Servicio para eliminar imagen Principal  */
export const fetchRemoveMainImage = async (data, id) => {
  try {
    const config = getRequestConfig({
      '_method': 'put',
      'Content-Type': 'application/json'
    })
    const response = await axios.put(`/servicios/${id}`, data, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para obtener datos de una  publicación en especifico */
export const fetchGetServicioById = async (id) => {
  try {
    const config = getAuthConfig()
    const response = await axios.get(`/servicios/${id}`, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para actualizar la informacion de una  publicación */
export const fetchUpdateService = async (id, data) => {
  try {
    const config = getRequestConfig({
      '_method': 'put',
      'Content-Type': 'application/json'
    })
    const response = await axios.put(`/servicios/${id}`, data, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para eliminar una publicación */
export const fetchDeleteService = async (id) => {
 
  try {
    const config = getRequestConfig({
      'Content-Type': 'application/json'
    })
    const response = await axios.delete(`/servicios/${id}`, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para actualizar imagenes */
export const fetchUpdateImages = async (id, data) => {
  try {
    const config = getRequestConfig({
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    })
    const response = await axios.post(`/servicios/${id}`, data, config)
    return response
  } catch (error) {
    throw error
  }
}

/* Servicio para crear un usuario desde el gestor de roles */

export const fetchCreateUser = async (data) => {
  try {
    const config = getRequestConfig({
      'accept': 'application/json',
      'Content-Type': 'application/json',
    })
    const response = await axios.post('/admin/users/registrar', data, config)
    return response
  } catch (error) {
    throw error
  }
}
