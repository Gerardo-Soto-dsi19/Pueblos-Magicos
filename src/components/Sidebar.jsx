import { useState, useContext } from "react";
import { AuthContext } from './AuthContext';
import { Link } from "react-router-dom"
import { FaInbox, FaCheckCircle, FaClock, FaExclamationCircle, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import ListadoSolicitudes from "./ListadoSolicitudes";
import Swal from 'sweetalert2';
import axios from 'axios';

function Sidebar() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const authToken = sessionStorage.getItem('accessToken');
    const [error, setError] = useState(null);


    const handleLogout = async () => {
        try {
            await axios.post('http://localhost/api/users/logout', null, {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            });
            console.log("Sesión finalizada");
            setIsAuthenticated(false);
            sessionStorage.removeItem('accessToken');
          } catch (error) {
            if (error.response) {
              console.error("Error al cerrar sesión:", error.response.data);
              // Muestra un mensaje de error al usuario o realiza otras acciones
            } else if (error.request) {
              console.error("Error de solicitud:", error.request);
              // Maneja el error de solicitud
            } else {
              console.error("Error desconocido:", error.message);
              // Maneja el error desconocido
            }
          }
    };
    return (
        <div className='md:flex '>
            <aside className="md:w-1/6 bg-[#6C1D45] text-white  border-white flex flex-col" >
                <div className='md:mb-32 md:mt-20'>
                    <div className=' mx-auto'>
                        <img src="../logo-ipn-lema-vertical-blanco.png" />
                    </div>
                </div>
                <ul className="flex flex-col items-center">
                    <li className='mb-2 w-full '>
                        <a href="#"
                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                        >
                            <FaInbox className="mr-2" />
                            Todas las solicitudes
                        </a>
                    </li>

                    <li className='mb-2 w-full text-center'>
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                        >
                            <FaCheckCircle className="mr-2" />Solicitudes aceptadas
                        </a>
                    </li>

                    <li className='mb-2 w-full text-center'>
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                        >
                            <FaClock className="mr-2" /> Solicitudes pendientes
                        </a>
                    </li>
                    <li className='mb-2 w-full text-center'>
                        <a
                            href="#"
                            className="flex items-center py-2 px-4 rounded-md transition duration-300 hover:bg-[#7C2C5C] text-white"
                        >
                            <FaExclamationCircle className="mr-2" /> Solicitudes con observación
                        </a>
                    </li>
                </ul>
                <div className=" mt-96 px-2 pt-10">
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
            </aside>

            <main className='md:w-5/6'>
                <h1 className=" mt-5 border-b-2 mx-3">Gestión de publicaciones</h1>
                <div className="mt-10">
                    <ListadoSolicitudes />
                </div>            <div>
                    {error && <div className="error-message">{error}</div>}
                    {/* Resto del código */}
                </div>
            </main>

        </div>
    )
}

export default Sidebar
