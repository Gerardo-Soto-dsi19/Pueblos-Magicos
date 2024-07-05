import React, { useEffect, useState } from 'react'
import CardSolicitud from './CardSolicitud'
import { Accordion } from "flowbite-react";
import { fetchTipoUsuario } from '../../api/api'

function ListadoSolicitudRoles() {
    const [dataUser, setDataUser] = useState([]);
    const [searchUser, setSearchUser] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetchTipoUsuario()
            if (response.status === 200) {
                setDataUser(response)
            } else {
                throw new Error('No fue posible listar la información');
            }
        } catch (error) {
            throw error
        }
    }

    // Refrescar los datos después de un cambio de rol
    const handleDataUpdate = () => {
        fetchData();
    };

    return (
        <div>
            <div className="mt-5 mx-5">
                <h2>Todas las solicitudes</h2>
            </div>
            <CardSolicitud
                dataUsers={dataUser}
                searchUsers={searchUser}
                onDataUpdate={handleDataUpdate}
            />
        </div>
    )
}

export default ListadoSolicitudRoles
