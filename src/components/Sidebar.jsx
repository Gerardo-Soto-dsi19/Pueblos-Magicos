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

                    <div>
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
                            <li className='mb-2 w-full text-center'>
                                <Link
                                    to="/formulario/registro"
                                    className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                                >
                                    <RiAddBoxFill className="mr-2" /> Registrar nueva publicación
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex justify-center mt-72">

                    </div>
                    <div className="mt-10">
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
            </aside >

            <main className='md:w-5/6'>
                <h1 className=" mt-5 border-b-2 mx-3">Gestión de publicaciones</h1>
                <div>
                    <ListadoSolicitudes
                        tipoSolicitud={selectedFilter}
                    />
                    <div className="flex justify-center">
                        <Link className="text-[#6C1D45] text-xs">Términos y condiciones</Link>
                    </div>
                </div>
            </main>

        </div >
    )
}

export default Sidebar
