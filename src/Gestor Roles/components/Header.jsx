import React from 'react'
import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle } from 'react-icons/fa';
import { Dropdown } from 'flowbite-react'
import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { fetchTipoUsuarioById } from "./../../api/api"
function Header() {

    const [typeUser, setTypeUser] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const userType = sessionStorage.getItem('tu');
        const idUserName = localStorage.getItem('user_name');
        setTypeUser(userType);
        getUserInfo(idUserName);
        console.log('tipo de usuario', userType);
    }, [])

    const getUserTypeLabel = () => {
        switch (typeUser) {
            case '1': return 'Administrador de sistema';
            case '2': return 'Director de pueblos magicos';
            case '3': return 'Pueblos mágicos';
            default: return '';
        }
    }

    const getUserInfo = async (id) => {
        try {
            const response = await fetchTipoUsuarioById(id);
            if (response.status === 200) {
                const nameUser = response.data.data.servicio[0].persona.nombre
                const secondNameUser = response.data.data.servicio[0].persona.apellido_pat
                const matNameUser = response.data.data.servicio[0].persona.apellido_mat
                setUserName(`${nameUser} ${secondNameUser} ${matNameUser}`);
                
            }
        } catch (error) {
            throw error
        }
    }

    return (
        <>
            <header className='bg-white border rounded-md px-4  py-2.5'>
                <div className='flex justify-between mt-1'>
                    <label>{getUserTypeLabel()}</label>
                    <div className='flex items-center cursor-pointer gap-10'>
                        <label>{userName}</label>
                        <Dropdown dismissOnClick={false} renderTrigger={() => <span><HiDotsVertical /></span>}>
                            <Dropdown.Item>
                                <Link to={'/editar/informacion-personal'}>
                                    <FaUserCircle className="inline-block mr-2" />
                                    <span>Editar perfil</span>
                                </Link>
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
