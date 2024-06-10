import React, { useState, useEffect } from 'react';
import { Badge, Dropdown } from 'flowbite-react'
import { HiDotsVertical } from "react-icons/hi";
import { Modal } from 'flowbite-react'
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import Swal from 'sweetalert2';
import { fetchTipoUsuarioById, fetchTypeUsers, fetchUpdateRole } from '../../api/api'
import '../../index.css'

function CardSolicitud({ dataUsers, onDataUpdate }) {
    const [toggledUsers, setToggledUsers] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [idUser, setIdUser] = useState('');
    const [dataInfoUsers, setDataInfoUsers] = useState([]);
    const [dataInfoUser, setDataInfoUser] = useState([]);
    const [rolUser, setRolUser] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        if (dataUsers && dataUsers.data && dataUsers.data.data && dataUsers.data.data.usuarios) {
            setDataInfoUsers(dataUsers.data.data.usuarios.data);
        }
        console.log(dataInfoUsers);
    }, [dataUsers]);

    const fetchUserById = async (id) => {
        try {
            const response = await fetchTipoUsuarioById(id)
            setDataInfoUser(response.data.data.servicio)
        } catch (error) {

        }

    }

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleCardClick = (id) => {
        setOpenModal(true)
        fetchUserById(id)
        setIdUser(id)
        handleTypesUsers()
    }

    const handleModalClose = () => {
        if (openModal) {
            setOpenModal(false)
            setRolUser(([]))
            setDataInfoUser(([]))
        }
    }

    const handleTypesUsers = async () => {
        try {
            const response = await fetchTypeUsers()
            console.log('respuesta del combo', response.data.data);
            setRolUser(response.data.data)
        } catch (error) {

        }
    }

    const handleToggle = async (userId) => {
        const isUserToggled = toggledUsers[userId];
        const confirmTitle = isUserToggled ? '¿Estás seguro?' : '¿Deseas activar este usuario?';
        const confirmText = isUserToggled ? '¿Deseas dar de baja a este usuario?' : '¿Estás seguro de que deseas activar a este usuario?';
        const confirmButtonText = isUserToggled ? 'Sí, dar de baja' : 'Sí, activar';

        const result = await Swal.fire({
            title: confirmTitle,
            text: confirmText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6C1D45',
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            setToggledUsers((prevToggledUsers) => ({
                ...prevToggledUsers,
                [userId]: !prevToggledUsers[userId],
            }));

            const successTitle = isUserToggled ? 'Dado de baja' : 'Activado';
            const successText = isUserToggled ? 'El usuario ha sido dado de baja exitosamente.' : 'El usuario ha sido activado exitosamente.';
            Swal.fire(successTitle, successText, 'success');
        }
    }

    const handleChangeRole = async () => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas cambiar el rol del usuario?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#6C1D45',
                confirmButtonText: 'Sí, cambiar rol',
                cancelButtonText: 'Cancelar',
            });
            if (result.isConfirmed) {
                const dataUpdated = {
                    data: {
                        user: {
                            'id_tipo_usuario': selectedRole,
                        }
                    },
                    _method: 'PUT'
                }
                const responseUpdate = await fetchUpdateRole(idUser, dataUpdated)
                if (responseUpdate.status === 200) {
                    Swal.fire('Éxito', 'El rol del usuario ha sido actualizado', 'success');
                    setOpenModal(false)
                    onDataUpdate();
                }
            }
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'Ocurrió un error al actualizar el rol', 'error');
        }
    }

    return (
        <>
            {dataInfoUsers.map((user) => (
                <div key={user.id} className='m-3 bg-white shadow-md px-5 py-4 rounded-xl flex justify-between'>
                    <div className='w-2/3'>
                        <p className='font-bold mb-3 text-gray-700  uppercase'>
                            Usuario: {''}
                            <span className='font-normal normal-case'>{user.user_name}</span>
                        </p>
                        <p className='font-bold mb-3 text-gray-700  uppercase'>
                            Tipo rol: {''}
                            <span className='font-normal normal-case'>{user.tipo.tipo_usuario}</span>
                        </p>
                        <div className="flex">
                            <p className='flex gap-3 font-bold text-gray-700  uppercase'>
                                Estado: {''}
                                <Badge
                                    color={
                                        user.id_estatus === 7 ? 'success'
                                            : user.id_estatus === 4 ? 'failure'
                                                : 'gray'
                                    } className='h-auto'>
                                    {user.estatus.estado}
                                </Badge>
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div className="flex flex-col items-center">
                            <p className='font-bold text-gray-700  uppercase'>{toggledUsers[user.id] ? 'Dar de baja' : 'Dar de alta'}</p>
                            <button
                                onClick={() => handleToggle(user.id)}
                                className={`toggle-button ${toggledUsers[user.id] ? 'toggled' : ''}`}
                            >
                                <div className="thumb"></div>
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center cursor-pointer'>
                        <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span><HiDotsVertical /></span>}>
                            <Dropdown.Item onClick={() => handleCardClick(user.id)}>Editar</Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
            ))}

            <Modal dismissible show={openModal} onClose={() => handleModalClose()}>
                <Modal.Header>Datos del usuario</Modal.Header>
                <Modal.Body>
                    {dataInfoUser.map((user) => (
                        <div key={user.id} className='grid gap-4 py-4'>
                            <div className='grid items-center grid-cols-[150px_1fr] gap-4'>
                                <label className='font-medium '>Nombre:</label>
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={user.persona.nombre}
                                        readOnly={true}
                                        className="col-span-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
                                    />
                                </div>
                            </div>
                            <div className='grid items-center grid-cols-[150px_1fr] gap-4'>
                                <label className='font-medium '>Apellido paterno:</label>
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={user.persona.apellido_pat}
                                        readOnly={true}
                                        className="col-span-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
                                    />
                                </div>
                                <label className='font-medium '>Apellido materno:</label>
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={user.persona.apellido_mat}
                                        readOnly={true}
                                        className="col-span-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
                                    />
                                </div>
                            </div>
                            <div className='grid items-center grid-cols-[150px_1fr] gap-4'>
                                <label className='font-medium '>Usuario:</label>
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={user.user_name}
                                        readOnly={true}
                                        className="col-span-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300"
                                    />
                                </div>
                            </div>
                            <div className='grid items-center grid-cols-[150px_1fr] gap-4'>
                                <label className='font-medium '>Rol:</label>
                                <div>
                                    <select
                                        name="tipo_usuario"
                                        value={selectedRole || user.tipo.tipo_usuario}
                                        onChange={handleRoleChange}
                                        className='col-span-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300'
                                    >
                                        <option value={user.tipo.tipo_usuario}>{user.tipo.tipo_usuario}</option>
                                        {rolUser.map((item) => (
                                            <option key={item.id} value={item.id}>{item.tipo_usuario}</option>
                                        ))}
                                    </select>

                                </div>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer className='mt-6 flex justify-end'>
                    <div className='flex gap-x-7'>
                        <button
                            type='button'
                            onClick={handleChangeRole}
                            className='md:flex-1 py-3 px-3 bg-[#6C1D45] hover:bg-[#8C3A68] text-white rounded-full'>
                            <HiCheckCircle />
                        </button>
                        <button
                            type='button'
                            onClick={handleModalClose}
                            className='md:flex-1 py-3 px-3 bg-[#6C1D45] hover:bg-[#8C3A68] text-white rounded-full'>
                            <HiXCircle />
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default CardSolicitud
