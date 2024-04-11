
import Sidebar from '../components/Sidebar'
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

function GestionSolicitudes() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    console.log('Error: el usuario no ha sido autenticado');
    return <Navigate to="/" replace />
  }
  return (
    <div>
      <Sidebar />
    </div>
  )
}

export default GestionSolicitudes
