import React from 'react'
import CardSolicitud from './CardSolicitud'
function ListadoSolicitudRoles() {
    return (
        <div>
            <div className="mt-5 mx-5">
                <h2>Todas las solicitudes</h2>
            </div>
            <CardSolicitud />
            <CardSolicitud />
            <CardSolicitud />
            <CardSolicitud />

        </div>
    )
}

export default ListadoSolicitudRoles
