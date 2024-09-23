import Sidebar from '../components/Sidebar';
import Header from './components/Header';
import ListadoSolicitudRoles from './components/ListadoSolicitudRoles';
import { AuthContext } from '../components/AuthContext';
import { useContext,useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FaLock, FaUserPlus } from "react-icons/fa";
import { RiAddBoxFill } from "react-icons/ri";
import { Link } from 'react-router-dom'
import Filtros from './components/Filtros';

function GestionRoles() {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) {
        console.log('Error: el usuario no ha sido autenticado');
        return <Navigate to="/" replace />
    }
    const [getAll, setGetAll] = useState(true);
    const [filtros, setFiltros] = useState({
        buscar: '',
        tipoUser: '',
        conTuristas: '0',
        estatusUser: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const aplicarFiltros = (nuevosFiltros) => {
        setFiltros(prevFiltros => ({ ...prevFiltros, ...nuevosFiltros }));
        setGetAll(false);
    };

    const menuItems = [
        { icon: <FaUserPlus className="mr-2" />, label: "Registrar nuevo usuario", to: "/gestor-usuarios/registro/usuarios" },
        { icon: <RiAddBoxFill className="mr-2" />, label: "Registrar nueva publicación", to: "/formulario/registro" },
        { icon: <FaLock className="mr-2" />, label: "Gestor de publicaiones", to: "/gestor-solicitudes" },
    ];
    return (
        <Sidebar menuItems={menuItems.filter(item => !item.condition || item.condition)}>
            <Header />
            <div>
                <h1 className="mt-5 mb-5 border-b-2 mx-5">Gestión de roles</h1>
            </div>
            <div className='grid md:grid-cols-[305px_1fr] gap-6 p-4 md:p-6'>
                <div className='flex flex-col bg-white border rounded-md p-4 w-full max-w-md'>
                    <Filtros filtros={filtros} onFiltroChange={aplicarFiltros} />
                </div>
                {isLoading ? (
                    <p>Cargando usuarios...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className='border rounded-md'>
                        <ListadoSolicitudRoles getAll={getAll} filtros={filtros} />
                    </div>
                )}
            </div>
            <div className="flex justify-center">
                <Link className="text-[#6C1D45] text-xs">Términos y condiciones</Link>
            </div>
        </Sidebar>
    )
}

export default GestionRoles
