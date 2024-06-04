import SidebarRoles from './SidebarRoles';
import { AuthContext } from '../components/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
function GestionRoles() {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) {
        console.log('Error: el usuario no ha sido autenticado');
        return <Navigate to="/" replace />
    }
    return (
        <div>
            <SidebarRoles/>
        </div>
    )
}

export default GestionRoles
