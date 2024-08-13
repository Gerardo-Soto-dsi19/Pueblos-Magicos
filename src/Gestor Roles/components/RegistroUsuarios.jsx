import { Outlet } from 'react-router-dom'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { Spinner } from 'flowbite-react'
import { fetchCreateUser } from '../../api/api'

function RegistroUsuarios() {
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
                }
            }
            const response = await fetchCreateUser(datosToSend)

            if (response.status === 200) {
                Toast.fire({
                    icon: "success",
                    title: "Se ha registrado con exito!"
                });
                resetData();
            } else if (response.status === 422) {
                Swal.fire({ title: 'Error al enviar los datos', text: 'Datos de entrada inválidos' })
            } else {
                Swal.fire('Error', 'No se ha podido realizar el registro, intentelo mas tarde.', 'error')
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // Imprimir la respuesta de la API
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
        <>
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
                                                    className='block w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]'
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
                                                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
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
                                                    className="blockw-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
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
                                                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
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
                                                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
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
                                                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 py-5 flex items-center justify-end gap-x-6">
                                <Link type="button" className="text-sm font-semibold leading-6 text-gray-900" to={"/gestor-roles"}>
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
        </>
    )
}

export default RegistroUsuarios
