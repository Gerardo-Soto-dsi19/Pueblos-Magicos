import React, { useEffect, useState } from 'react'
import CardSolicitud from './CardSolicitud'
import { fetchTipoUsuario } from '../../api/api'

function ListadoSolicitudRoles({ filtros }) {
    const [dataUser, setDataUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filtros]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchTipoUsuario(filtros); // Pasamos los filtros a la función de fetching
            if (response.status === 200) {
                setDataUser(response.data); // Asumiendo que los datos están en response.data
            } else {
                throw new Error('No fue posible listar la información');
            }
        } catch (error) {
            setError('Error al cargar los usuarios: ' + error.message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Refrescar los datos después de un cambio de rol
    const handleDataUpdate = () => {
        fetchData();
    };

    if (isLoading) {
        return <div>Cargando usuarios...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
