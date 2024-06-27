import React, { useEffect, useState } from 'react'
import CardSolicitud from './CardSolicitud'
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
    
    const handleChange = (e) =>{
        setSearchUser(e.target.value)

    };

    

    return (
        <div>
            <div className="mt-5 mx-5">
                <h2>Todas las solicitudes</h2>
            </div>
            <div className='container mx-auto px-4 mt-5'>
                <div className='flex'>
                    <input
                        type="text"
                        className='flex-grow rounded-l-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]'
                        placeholder='Buscar un usuario'
                        onChange={handleChange}
                    />
                    <button
                        type='button'
                        className='rounded-r-md bg-[#6C1D45] hover:bg-[#8C3A68] px-4 py-1.5 text-white'
                    >
                        Buscar
                    </button>
                </div>
            </div>
            <CardSolicitud
                dataUsers={dataUser}
                onDataUpdate={handleDataUpdate}
            />
        </div>
    )
}

export default ListadoSolicitudRoles
