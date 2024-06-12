import { Outlet } from 'react-router-dom'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { Spinner } from 'flowbite-react'
import { createUser } from '../api/api'


function RegistroLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    password_confirmation: '',
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    id_tipo_usuario: ''
  });
  const resetData = () => {
    setFormData({
      user_name: '',
      password: '',
      password_confirmation: '',
      nombre: '',
      apellido_pat: '',
      apellido_mat: '',
      id_tipo_usuario: ''
    })
  }
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
 

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else if (name === 'id_tipo_usuario') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const datosToSend = {
        data: {
          user_name: formData.user_name,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          nombre: formData.nombre,
          apellido_pat: formData.apellido_pat,
          apellido_mat: formData.apellido_mat,
          id_tipo_usuario: formData.id_tipo_usuario
        }
      }
      const response = await createUser(datosToSend)

      if (response.status === 200 || response.status === 201) {
        console.log('Datos enviados exitosamente');
        Toast.fire({
          icon: "success",
          title: "Se ha registrado con exito!"
        });
        resetData();
      } else if (response.status === 422) {
        console.log('Unprocessable Contentaaaa');
      } else {
        console.log('Error al enviar los datos:');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Imprimir la respuesta de la API
        console.log('Error al enviar los datos:', error.response.data);
        const camposNoLlenados = Object.entries(error.response.data.data).flatMap(([campo, errores]) =>
          errores.map((error) => `-${error}`)
        );

        const mensajeError = `Los siguientes campos no se llenaron correctamente:\n\n\n${camposNoLlenados.join('\n\n')}`;


        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
        })
      }
    } finally {
      setIsLoading(false)
    }
  };
  return (
    <div className='md:flex justify-center items-center bg-white'>
      <div className="border-slate-700 shadow-lg rounded-lg mt-10 mb-10 px-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center">
              <h3 className="mb-4">Enviando solicitud</h3>
              <div className="lds-ring">
                <Spinner className="spinner-custom" size="xl" />
              </div>
            </div>
          </div>
        ) : (

          <form onSubmit={handleSubmit} className='mt-10'>
            <h1>Registrar usuario</h1>
            <div className="space-y-12 mb-10">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Información Personal</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Utilice una dirección email permanente en la que pueda recibir correos.</p>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="nombre" className="block text-sm font-medium leading-6 text-gray-900">
                      Nombre(s)
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={formData.nombre} onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="apellido_pat" className="block text-sm font-medium leading-6 text-gray-900">
                      Primer apellido
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="apellido_pat"
                        id="apellido_pat"
                        value={formData.apellido_pat} onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="apellido_mat" className="block text-sm font-medium leading-6 text-gray-900">
                      Segundo apellido
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="apellido_mat"
                        id="apellido_mat"
                        value={formData.apellido_mat} onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="user_name" className="block text-sm font-medium leading-6 text-gray-900">
                      Correo
                    </label>
                    <div className="mt-2">
                      <input
                        id="user_name"
                        name="user_name"
                        type="email"
                        value={formData.user_name} onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Contraseña
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password} onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                      Confirmar contraseña
                    </label>
                    <div className="mt-2">
                      <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation} onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">Tipo pueblo mágico</legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Por favor indique a qué sector está enfocado</p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-pueblo"
                          name="id_tipo_usuario"
                          type="radio"
                          value={5}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-[#6C1D45]"
                        />
                        <label htmlFor="push-pueblo" className="block text-sm font-medium leading-6 text-gray-900">
                          Pueblo Mágico
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-hotelero"
                          name="id_tipo_usuario"
                          type="radio"
                          value={3}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-[#6C1D45]"
                        />
                        <label htmlFor="push-hotelero" className="block text-sm font-medium leading-6 text-gray-900">
                          Hotelero
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-restaurantero"
                          name="id_tipo_usuario"
                          type="radio"
                          value={4}
                          onChange={handleChange}
                          className="form-radio h-4 w-4 text-[#6C1D45]"
                        />
                        <label htmlFor="push-restaurantero" className="block text-sm font-medium leading-6 text-gray-900">
                          Restaurantero
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            <div className="mt-6 py-5 flex items-center justify-end gap-x-6">
              <Link type="button" className="text-sm font-semibold leading-6 text-gray-900" to={"/"}>
                Cancelar
              </Link>
              <button
                type="submit"
                className="rounded-md bg-[#6C1D45] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(90,18,54,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Registrar
              </button>
            </div>
          </form>

        )}
      </div>
      <Outlet />
    </div>
  )
}

export default RegistroLogin
