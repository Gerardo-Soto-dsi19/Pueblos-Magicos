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
        {
            icon: <FaLock className="mr-2" />, label: "Gestor de roles", to: "/gestor-roles",
            condition: sessionStorage.getItem("tu") === "1" || sessionStorage.getItem("tu") === "2"
        },
    ];
    
    const filteredMenuItems = menuItems.filter(item => !item.hasOwnProperty('condition') || item.condition);

    return (
        <Sidebar menuItems={filteredMenuItems}>
            <Header />
            <div className='mt-14'>
                <EditarInformacion idUsuario={localStorage.getItem('user_name')} />
            </div>
        </Sidebar>
    );
}

export default PerfilUsuario;