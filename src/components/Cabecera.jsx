import { Link } from "react-router-dom";
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from "axios";

function Cabecera() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const authToken = sessionStorage.getItem('accessToken');
    const [isOpen, setIsOpen] = useState(false);

    const ADMIN_TYPE = '1';
    const MANAGER_VILLAGES = '2';

    const hasPermission = isAuthenticated &&
        (sessionStorage.getItem('tu') === ADMIN_TYPE ||
            sessionStorage.getItem('tu') === MANAGER_VILLAGES);

    const handleLogout = () => {
        try {
            const response = axios.post('http://localhost/api/users/logout', null, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            sessionStorage.removeItem('accessToken');
            document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            setIsAuthenticated(false);
            sessionStorage.removeItem('accessToken')
            return response
        } catch (error) {
            throw error
        }
    };


    return (
        <div>
            <header className='bg-[#6c1d45] border-gray-200 px-4 lg:px-6 py-2.5'>
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <div className="flex items-center lg:order-2">
                        <button
                            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
                        {isAuthenticated && (
                            <Link
                                onClick={handleLogout}
                                className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                            >
                                Cerrar sesión
                            </Link>
                        )/*  : (
                            <Link
                                to="/"
                                className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                            >
                                Iniciar sesión
                            </Link>
                        ) */}
                    </div>
                    <div className={`${isOpen ? 'block' : 'hidden'} w-full lg:block lg:w-auto`} id="mobile-menu">
                        <nav>
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <Link
                                        to="/gestor-solicitudes"
                                        className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                    >
                                        Gestor de publicaciones
                                    </Link>
                                </li>
                                {hasPermission && (
                                    <li>
                                        <Link
                                            to="/gestor-roles"
                                            className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white"
                                        >
                                            Gestor de roles
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Cabecera