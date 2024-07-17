import React, { useEffect, useState } from 'react'
import { Card } from "flowbite-react";
import Swal from 'sweetalert2';
import { fetchTipoUsuarioById, fetchUpdateRole } from '../../api/api';

function EditarInformacion({ idUsuario }) {
    const [dataUser, setDataUser] = useState(null)
    const [originalData, setOriginalData] = useState(null);
    const [formData, setFormData] = useState({
        data: {
            user: {
                user_name: '',
            },
            datosP: {
                nombre: '',
                apellido_pat: '',
                apellido_mat: '',

            }
        }
    })
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState({
        password: '',
        password_confirmation: ''
    })

    useEffect(() => {
        if (idUsuario) {
            fetchData()
        }
    }, [idUsuario])

    const fetchData = async () => {
        try {

            const response = await fetchTipoUsuarioById(idUsuario)
            if (response.status === 200) {
                const userData = response.data.data.servicio[0];
                setDataUser(userData)
            } else {
                console.log("Error fetching data:", response.status);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        if (dataUser) {
            const newData = {
                data: {
                    user: {
                        user_name: dataUser.user_name
                    },
                    datosP: {
                        nombre: dataUser.persona.nombre,
                        apellido_pat: dataUser.persona.apellido_pat,
                        apellido_mat: dataUser.persona.apellido_mat,
                    }
                }
            };
            setFormData(newData);
            setOriginalData(newData);
        }
    }, [dataUser])

    const hasChanges = () => {
        if (!originalData) return false;

        const { user, datosP } = formData.data;
        const { user: originalUser, datosP: originalDatosP } = originalData.data;

        const hasProfileChanges =
            user.user_name !== originalUser.user_name ||
            datosP.nombre !== originalDatosP.nombre ||
            datosP.apellido_pat !== originalDatosP.apellido_pat ||
            datosP.apellido_mat !== originalDatosP.apellido_mat;

        const hasPasswordChanges =
            showPasswordFields &&
            (passwordData.password.trim() !== '' || passwordData.password_confirmation.trim() !== '');

        return hasProfileChanges || hasPasswordChanges;
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setShowPasswordFields(isChecked);
        if (!isChecked) {
            setPasswordData({ password: '', password_confirmation: '' });
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'user_name') {
            setFormData(prevState => ({
                ...prevState,
                data: {
                    ...prevState.data,
                    user: {
                        ...prevState.data.user,
                        [name]: value
                    }
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                data: {
                    ...prevState.data,
                    datosP: {
                        ...prevState.data.datosP,
                        [name]: value
                    }
                }
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!hasChanges()) {
            alert("No se han realizado cambios.");
            return;
        }

        let dataToUpdate = {
            data: {
                user: {
                    user_name: formData.data.user.user_name,
                },
                datosP: {
                    nombre: formData.data.datosP.nombre,
                    apellido_pat: formData.data.datosP.apellido_pat,
                    apellido_mat: formData.data.datosP.apellido_mat,
                }
            },
            _method: 'PUT'
        }

        if (showPasswordFields && passwordData.password && passwordData.password_confirmation) {
            dataToUpdate.data.user.password = passwordData.password;
            dataToUpdate.data.user.password_confirmation = passwordData.password_confirmation;
        }

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas modificar tu informacion?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#6C1D45',
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
        })

        if (result.isConfirmed) {
            try {
                const response = await fetchUpdateRole(idUsuario, dataToUpdate);
                if (response.status === 200) {
                    Swal.fire('Actualizado', 'Se ha actualizado la información de manera correcta', 'success')
                    setOriginalData(formData);
                    if (showPasswordFields) {
                        setPasswordData({ password: '', password_confirmation: '' });
                        setShowPasswordFields(false);
                    }
                } else {
                    alert('Error al actualizar el perfil');
                    Swal.fire('Error al actualizar la información','error')
                }
            } catch (error) {
                console.log('Error al hacer update', error);
                Swal.fire('Error al actualizar la información','error')
            }
        }
    }


    return (
        <div className='max-w-2xl mx-auto'>
            <Card className="p-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">Editar perfil</h2>
                    <p className="text-base text-gray-600">Actualiza tu información personal.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                            name="nombre"
                            placeholder="Ingresa tu nombre"
                            value={formData.data.datosP.nombre}
                            onChange={handleChange}
                            className="w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido paterno</label>
                        <input
                            name="apellido_pat"
                            placeholder="Ingresa tu apellido paterno"
                            value={formData.data.datosP.apellido_pat}
                            onChange={handleChange}
                            className="w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido materno</label>
                        <input
                            name="apellido_mat"
                            placeholder="Ingresa tu apellido materno"
                            value={formData.data.datosP.apellido_mat}
                            onChange={handleChange}
                            className="w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                        <input
                            name="user_name"
                            type="email"
                            placeholder="Ingresa tu correo"
                            value={formData.data.user.user_name}
                            onChange={handleChange}
                            className="w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="updatePassword"
                            checked={showPasswordFields}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        <label htmlFor="updatePassword" className="text-sm font-medium text-gray-700">
                            Actualizar contraseña
                        </label>
                    </div>
                    {showPasswordFields && (
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
                                <input
                                    type='password'
                                    name='password'
                                    value={passwordData.password}
                                    onChange={handlePasswordChange}
                                    placeholder="Nueva contraseña"
                                    className="w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                                <input
                                    type='password'
                                    name='password_confirmation'
                                    value={passwordData.password_confirmation}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirmar contraseña"
                                    className="w-full rounded-md border-0 py-2 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                                />
                            </div>
                        </div>
                    )}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full bg-[#6C1D45] text-white py-3 px-6 rounded-md text-lg hover:bg-[#5A1839] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C1D45]"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default EditarInformacion
