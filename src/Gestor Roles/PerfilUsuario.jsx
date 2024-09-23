import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from './components/Header';
import EditarInformacion from "./components/EditarInformacion";
import { RiAddBoxFill } from "react-icons/ri";
import { FaBook, FaLock } from "react-icons/fa";

function PerfilUsuario() {
    const menuItems = [
        { icon: <RiAddBoxFill className="mr-2" />, label: "Registrar nueva publicación", to: "/formulario/registro" },
        { icon: <FaBook className="mr-2" />, label: "Gestor de publicaciones", to: "/gestor-solicitudes" },
        { icon: <FaLock className="mr-2" />, label: "Gestor de roles", to: "/gestor-roles", 
          condition: sessionStorage.getItem("tu") === "1" || sessionStorage.getItem("tu") === "2" },
    ];

    return (
        <Sidebar menuItems={menuItems.filter(item => !item.condition || item.condition)}>
            <Header />
            <div className='mt-14'>
                <EditarInformacion idUsuario={localStorage.getItem('user_name')} />
            </div>
        </Sidebar>
    );
}

export default PerfilUsuario;