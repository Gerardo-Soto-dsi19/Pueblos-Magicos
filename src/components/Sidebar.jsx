import { useState, useContext } from "react";
import { AuthContext } from './AuthContext';
import { Link } from "react-router-dom"
import { FaInbox, FaCheckCircle, FaClock, FaExclamationCircle, FaSignInAlt, FaSignOutAlt, FaRegistered } from "react-icons/fa";
import { RiAddBoxFill } from "react-icons/ri";
import ListadoSolicitudes from "./ListadoSolicitudes";
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
        <div className='md:flex '>
            <aside className="md:w-1/6 h-[100%] bg-[#6C1D45] text-white  border-white flex flex-col" >
                <div className="">
                    <div className='md:mb-32'>
                        <div className=' mx-auto'>
                            <img src="../logo-ipn-lema-vertical-blanco.png" />
                        </div>
                    </div>
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

                        <ul>
                            <li className='mb-2 w-full '>
                                <Link
                                    onClick={() => handleFilterChange('all')}
                                    className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                >
                                    <FaInbox className="mr-2" />
                                    Todas las solicitudes
                                </Link>
                            </li>

                            <li className='mb-2 w-full text-center'>
                                <Link
                                    onClick={() => handleFilterChange('2')}
                                    className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                >
                                    <FaCheckCircle className="mr-2" />Solicitudes aceptadas
                                </Link>
                            </li>

                            <li className='mb-2 w-full text-center'>
                                <Link
                                    onClick={() => handleFilterChange('1')}
                                    className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                >
                                    <FaClock className="mr-2" /> Solicitudes pendientes
                                </Link>
                            </li>
                            <li className='mb-2 w-full text-center'>
                                <Link
                                    onClick={() => handleFilterChange('3')}
                                    className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                >
                                    <FaExclamationCircle className="mr-2" /> Solicitudes con observación
                                </Link>
                            </li>
                            <li className='md:mb-2 w-full text-center'>
                                <Link
                                    to="/formulario/registro"
                                    className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                >
                                    <RiAddBoxFill className="mr-2" /> Registrar nueva publicación
                                </Link>
                            </li>
                        </ul>
                        <div className="flex md:mt-60 sm: mt-10">

                        </div>
                        <div className="md:mt-10">
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

            <main className='md:w-5/6'>
                <h1 className=" mt-10 border-b-2 mx-5">Gestión de publicaciones</h1>
                <div>
                    <ListadoSolicitudes                
                        tipoSolicitud={selectedFilter}
                    />
                    <div className="flex justify-center ">
                        <Link className="text-[#6C1D45] text-xs">Términos y condiciones</Link>
                    </div>
                </div>
            </main>

        </div >
    )
}

export default Sidebar
