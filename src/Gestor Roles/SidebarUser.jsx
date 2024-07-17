import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import { AuthContext } from '../components/AuthContext';
import { Link, Navigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaBook } from "react-icons/fa";
import { RiAddBoxFill } from "react-icons/ri";
import { fetchLogOut } from '../api/api'
import Header from './components/Header';
import EditarInformacion from './components/EditarInformacion';
function SidebarUser() {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) {
        console.log('Error: el usuario no ha sido autenticado');
        return <Navigate to="/" replace />
    }


    const [isOpen, setIsOpen] = useState(false);
    const [idUsuario, setIdUsuario] = useState('')
    
    useEffect(() => {
        const id = localStorage.getItem('user_name');
        setIdUsuario(id)
    });

    const handleLogout = async () => {
        try {
            await fetchLogOut();
            setIsAuthenticated(false);
            sessionStorage.removeItem('accessToken');
        } catch (error) {
            if (error.response) {
                console.error("Error al cerrar sesión:", error.response.data);
            } else if (error.request) {
                console.error("Error de solicitud:", error.request);
            } else {
                console.error("Error desconocido:", error.message);
            }
        }
    };

    return (
        <>
            <div className='md:flex'>
                <aside className="md:w-1/6 md:h-[100%] bg-[#6C1D45] text-white  border-white flex flex-col justify-between" >
                    <div className='md:mb-52'>
                        <div className=' mx-auto'>
                            <img src="../logo-ipn-lema-vertical-blanco.png" />
                        </div>
                    </div>
                    <div className='flex-grow'>
                        <button
                            className="inline-flex items-center mb-5 p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        <div className={`${isOpen ? 'block' : 'hidden'} w-full lg:block lg:w-auto`} id="mobile-menu">
                            <div className='flex flex-col'>
                                <ul>
                                    <li className='md:mb-2 w-full text-center'>
                                    </li>
                                    <li className='md:mb-2 w-full text-center'>
                                    </li>
                                    <li className='md:mb-2 w-full text-center'>
                                    </li>
                                    <li className='md:mb-2 w-full text-center'>
                                        <Link
                                            to="/formulario/registro"
                                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                        >
                                            <RiAddBoxFill className="mr-2" /> Registrar nueva publicación
                                        </Link>
                                    </li>
                                    <li className='md:mb-2 w-full text-center'>
                                        <Link
                                            to="/gestor-solicitudes"
                                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                        >
                                            <FaBook className="mr-2" /> Gestor de publicaciones
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex md:mt-80 sm: mt-10">

                            </div>
                            <div className="pt-4">
                                {isAuthenticated ? (
                                    <Link
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white "
                                    >
                                        <FaSignOutAlt />Cerrar sesión
                                    </Link>

                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                    >
                                        <FaSignInAlt />Iniciar sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </aside >
                <main className='md:w-5/6 h-screen'>
                    <Header />
                    <div className='mt-14'>
                        <EditarInformacion
                            idUsuario={idUsuario}
                        />
                    </div>
                </main>
            </div>

        </>
    )
}

export default SidebarUser
