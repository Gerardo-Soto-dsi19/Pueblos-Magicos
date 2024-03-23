import { FaInbox, FaCheckCircle, FaClock } from "react-icons/fa";
import ListadoSolicitudes from "./ListadoSolicitudes";

function Sidebar() {
    return (
        <div className='md:flex md: min-h-screen'>
            <aside className="md:w-1/6 bg-[#6C1D45] text-white  border-white flex flex-col" >
                <div className='mb-32'>
                    <div className=' mx-auto'>
                        <img src="../public/logo-ipn-lema-vertical-blanco.png" />
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
                </ul>
            </aside>
            <main className='md:w-5/6'>
                <div>                    
                    <ListadoSolicitudes/>
                </div>
            </main>
        </div>
    )
}

export default Sidebar
