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
            //console.log(response);
            setDataUser(response)
        } catch (error) {

        }
    }
    return (
        <div>
            <div className="mt-5 mx-5">
                <h2>Todas las solicitudes</h2>
            </div>
            <CardSolicitud
                dataUsers={dataUser}
            />
        </div>
    )
}

export default ListadoSolicitudRoles
