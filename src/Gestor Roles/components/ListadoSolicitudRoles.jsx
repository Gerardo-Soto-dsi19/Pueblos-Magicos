import React, { useEffect, useState } from 'react'

import CardSolicitud from './CardSolicitud'
import { fetchTipoUsuario } from '../../api/api'

function ListadoSolicitudRoles() {
    const [dataUser, setDataUser] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetchTipoUsuario()
            console.log(response);
            setDataUser(response)
        } catch (error) {
            console.log(error);
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
                onDataUpdate={handleDataUpdate}
            />
        </div>
    )
}

export default ListadoSolicitudRoles
