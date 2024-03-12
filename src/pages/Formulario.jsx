import React, { useEffect, useState } from "react"
import axios from "axios"



const apiBaseUrl = 'https://dev.plataforma.ipn.mx:8097';
const authToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4OEZ3YXdJWmFVU2FmMWozOEhBMm5IVDh2clU2LWU5U1Uyc0ZvUExWRzZnIn0.eyJleHAiOjE3MDk5MTkzNzAsImlhdCI6MTcwOTkxOTA3MCwianRpIjoiMmI3ODU4NTctMDM2Zi00ZjNiLTkxNGQtZDFhZWJjYzkwODUwIiwiaXNzIjoiaHR0cHM6Ly9kZXYucGxhdGFmb3JtYS5pcG4ubXgvYXV0aC9yZWFsbXMvZGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImQyNTI3YzUyLWM2ZGMtNGI0ZS1hZGM2LTEzOTk1Y2RkNGRkNCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImRzaS5wbGF0YWZvcm1hLmRleXNzIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRldiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InJvbGVzIHByb2ZpbGUgZW1haWwiLCJjbGllbnRIb3N0IjoiMTI3LjAuMC4xIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJjbGllbnRJZCI6ImRzaS5wbGF0YWZvcm1hLmRleXNzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWRzaS5wbGF0YWZvcm1hLmRleXNzIiwiY2xpZW50QWRkcmVzcyI6IjEyNy4wLjAuMSJ9.oYY8zomOwNrjlHSaM4OfBJVMQ8l-C-BouGe10JvvUjv2Mrq7CPvxTvt9262jHVF993Lgzsd2PkMQWaEhQAyF-fdRgugR-2iHPIZI1tq8f-_5d0JHPuB2X96E0y8iVjoewczI4NZ0QiDmcXZK5Y08Lggc9yoAznH_mJgtoJmne9Jy16P9U0PZo3E-1j-mAM_S6owc_bqPk2xXPwWVx0XzLhroCV94FpKLJThP_ZHzXg2Djfp1AnMBgRomBQgnRvXmpUfI9S3llgb3AeC-e_DQkWByMIhVzEZwtRZ57QV7-76EYXweOIR9uOEJOFmdUBKVycJjXUCTYilEzI40osBWSQ';


async function getToken() {

  const urlToken = 'https://dev.plataforma.ipn.mx/auth/realms/dev/protocol/openid-connect/token';
  const client_id = 'dsi.plataforma.deyss';
  const client_secret = 'Db9Vj0To1aRJzOjzzc05DaKP4PjXYtnz';

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);

  try {
    const respuesta = await axios.post(urlToken, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',

      },
    });

    if (respuesta.status === 200) {
      // El token se encuentra en respuesta.data.access_token
      return respuesta.data.access_token;
    } else {
      throw new Error(`Error al obtener el token: ${respuesta.data.error_description}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }

}

function Formulario() {
  getToken()
    .then((token) => {
      console.log('Token obtenido:', token);
      // Aquí puedes utilizar el token para realizar solicitudes autenticadas
    })
    .catch((error) => {
      console.error('Error al obtener el token:', error);
    });
  /*   const [data, setData] = useState([]);
  
    useEffect(() => {
      axios.get(`${apiBaseUrl}/deyss/solicitudesSS/`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        }
      })
        .then(response => {
          setData(response.data);
          console.log("Informacion dentro del data:", data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []); */
  return (
    <>
      <div className="border-slate-700 shadow-lg rounded-lg mt-10 mb-10 px-20">
        <h1>Formulario</h1>
        <form>
          <div className="space-y-12 mb-10">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Pueblo Magico
                  </label>
                  <div className="mt-2">
                    <select
                      id="#"
                      name="#"
                      autoComplete="#"
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Categoria
                  </label>
                  <div className="mt-2">
                    <select
                      id="#"
                      name="#"
                      autoComplete="#"
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>Hospedaje</option>
                      <option>Gasto</option>
                      <option>Tours</option>
                      <option>Sitios</option>
                      <option>Festividades</option>
                      <option>Cerca de ustedes</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                    Nombre
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="street-address"
                      id="street-address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                      Descripcion
                    </label>
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Días de servicio
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="#"
                      id="#"
                      autoComplete="dias-servicio"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Horario
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="#"
                      id="#"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                    Precio
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                    Teléfono
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="Latitud" className="block text-sm font-medium leading-6 text-gray-900">
                    Latitud
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="latitud"
                      id="latitud"
                      autoComplete="latitud"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="longitud" className="block text-sm font-medium leading-6 text-gray-900">
                    Longitud
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="longitud"
                      id="longitud"
                      autoComplete="longitud"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Imagenes
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">                  
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                    >
                      <span>Sube un archivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
              </div>
            </div>


          </div>

          <div className="mt-6 py-5 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#5A1236] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(90,18,54,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Formulario
