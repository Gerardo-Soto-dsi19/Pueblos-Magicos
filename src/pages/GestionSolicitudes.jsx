import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import Header from '../Gestor Roles/components/Header';
import ListadoSolicitudes from '../components/ListadoSolicitudes';
import { FaInbox, FaCheckCircle, FaClock, FaExclamationCircle, FaLock } from "react-icons/fa";
import { LuPowerOff } from "react-icons/lu";
import { RiAddBoxFill } from "react-icons/ri";
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';

function GestionSolicitudes() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const typeUser = sessionStorage.getItem("tu");
    setUserType(typeUser);
  }, []);



  if (!isAuthenticated) {
    //Swal.fire('Error', 'El usuario no ha sido autenticado', 'error')
    return <Navigate to="/" replace />
  }

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  }

  const menuItems = [
    { icon: <FaInbox className="mr-2" />, label: "Todas las solicitudes", onClick: () => handleFilterChange('all') },
    { icon: <FaCheckCircle className="mr-2" />, label: "Solicitudes aceptadas", onClick: () => handleFilterChange('2') },
    { icon: <FaClock className="mr-2" />, label: "Solicitudes pendientes", onClick: () => handleFilterChange('1') },
    { icon: <FaExclamationCircle className="mr-2" />, label: "Solicitudes con observación", onClick: () => handleFilterChange('3') },
    { icon: <LuPowerOff className="mr-2" />, label: "Solicitudes inactivas", onClick: () => handleFilterChange('4') },
    { icon: <RiAddBoxFill className="mr-2" />, label: "Registrar nueva publicación", to: "/formulario/registro" },
    {
      icon: <FaLock className="mr-2" />,
      label: "Gestor de roles",
      to: "/gestor-roles",
      condition: userType === "1" || userType === "2"
    },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.hasOwnProperty('condition') || item.condition);

  return (
    <Sidebar menuItems={filteredMenuItems}>
      <Header />
      <h1 className="mt-10 border-b-2 mx-5">Gestión de publicaciones</h1>
      <ListadoSolicitudes tipoSolicitud={selectedFilter} />
      <div className="flex justify-center">
        <Link className="text-[#6C1D45] text-xs">Términos y condiciones</Link>
      </div>
    </Sidebar>
  )
}

export default GestionSolicitudes
