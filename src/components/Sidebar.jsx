import { useState, useContext } from "react";
import { AuthContext } from './AuthContext';
import { Link } from "react-router-dom"
import {FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

import { fetchLogOut } from '../api/api'

function Sidebar({ menuItems, children }) {
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
                    <div className="mb-40">
                        <div className='mx-auto'>
                            <img src="../logo-ipn-lema-vertical-blanco.png" alt="Logo IPN" />
                        </div>
                    </div>

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
                                {menuItems.map((item, index) => (
                                    <li key={index} className='mb-4 w-full text-center'>
                                        <Link
                                            to={item.to}
                                            onClick={() => item.onClick && item.onClick()}
                                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

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
                {children}
            </main>
        </div>
    )
}

export default Sidebar
