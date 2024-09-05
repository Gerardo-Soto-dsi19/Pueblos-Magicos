import { useState, useContext } from "react";
import { AuthContext } from './AuthContext';
import { Link } from "react-router-dom"
import { FaInbox, FaCheckCircle, FaClock, FaExclamationCircle, FaSignInAlt, FaSignOutAlt, FaUser, FaLock } from "react-icons/fa";
import { LuPowerOff } from "react-icons/lu";
import { RiAddBoxFill } from "react-icons/ri";
import ListadoSolicitudes from "./ListadoSolicitudes";
import Header from "../Gestor Roles/components/Header";
import { fetchLogOut } from '../api/api'

function Sidebar() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

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
        <div className='md:flex min-h-screen'>
            <aside className="md:w-1/6 bg-[#6C1D45] text-white border-white flex flex-col">
                <div className="flex flex-col h-full">
                    {/* <!-- Parte superior: Logo --> */}
                    <div className="mb-40">
                        <div className='mx-auto'>
                            <img src="../logo-ipn-lema-vertical-blanco.png" alt="Logo IPN"  />
                        </div>
                    </div>

                    {/* <!-- Parte media: Opciones de menú --> */}
                    <div className="flex-grow overflow-y-auto">
                        <button
                            className="lg:hidden w-full text-left p-4 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <svg className="w-6 h-6 inline mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                            </svg>
                            Menu
                        </button>
                        <div className={`${isOpen ? 'block' : 'hidden'} w-full lg:block`} id="mobile-menu">
                            <ul className="py-10">
                                <li className='mb-4 w-full text-center'>
                                    <Link onClick={() => handleFilterChange('all')} className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white">
                                        <FaInbox className="mr-2" />
                                        Todas las solicitudes
                                    </Link>
                                </li>
                                <li className='mb-4 w-full text-center'>
                                    <Link
                                        onClick={() => handleFilterChange('2')}
                                        className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                    >
                                        <FaCheckCircle className="mr-2" />Solicitudes aceptadas
                                    </Link>
                                </li>

                                <li className='mb-4 w-full text-center'>
                                    <Link
                                        onClick={() => handleFilterChange('1')}
                                        className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                    >
                                        <FaClock className="mr-2" /> Solicitudes pendientes
                                    </Link>
                                </li>
                                <li className='mb-4 w-full text-center'>
                                    <Link
                                        onClick={() => handleFilterChange('3')}
                                        className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                    >
                                        <FaExclamationCircle className="mr-2" /> Solicitudes con observación
                                    </Link>
                                </li>
                                <li className='mb-4 w-full text-center'>
                                    <Link
                                        onClick={() => handleFilterChange('4')}
                                        className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                    >
                                        <LuPowerOff className="mr-2" /> Solicitudes inactivas
                                    </Link>
                                </li>
                                <li className='md:mb-4 w-full text-center'>
                                    <Link
                                        to="/formulario/registro"
                                        className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                    >
                                        <RiAddBoxFill className="mr-2" /> Registrar nueva publicación
                                    </Link>
                                </li>
                                {(sessionStorage.getItem("tu") === "1" || sessionStorage.getItem("tu") === "2") && (
                                    <li className='md:mb-4 w-full text-center'>

                                        <Link
                                            to="/gestor-roles"
                                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                        >
                                            <FaLock className="mr-2" /> Gestor de roles
                                        </Link>
                                    </li>
                                )}

                            </ul>
                        </div>
                    </div>

                    {/* <!-- Parte inferior: Cerrar sesión --> */}
                    <div>
                        {isAuthenticated ? (
                            <Link
                                onClick={handleLogout}
                                className="flex items-center gap-2 py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
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
            </aside>
            <main className='md:w-5/6 flex flex-col'>
                <Header />
                <h1 className="mt-10 border-b-2 mx-5">Gestión de publicaciones</h1>
                <div>
                    <ListadoSolicitudes tipoSolicitud={selectedFilter} />
                    <div className="flex justify-center">
                        <Link className="text-[#6C1D45] text-xs">Términos y condiciones</Link>
                    </div>
                </div>
            </main>
        </div >
    )
}

export default Sidebar
