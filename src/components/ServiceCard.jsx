import React from 'react';
import { Carousel, Dropdown, Badge } from 'flowbite-react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { LuPowerOff } from 'react-icons/lu';
import { FaCheck, FaTrash } from 'react-icons/fa';

const ServicioCard = ({
    servicio,
    isValidating,
    handleCardClickActive,
    handleToggleServiceStatus,
    handleDeletePublication,
    handleCardClick
}) => {
    const isServiceActive = servicio.id_estatus !== 4; // Asumiendo que 4 es el estado inactivo

    return (
        <div className="relative m-3 bg-white shadow-md px-5 py-6 rounded-xl">
            <div className="absolute top-4 right-0.5 cursor-pointer" onClick={() => handleCardClickActive(servicio.id, servicio.id_estatus)}>
                {(!isValidating || sessionStorage.getItem('tu') === '1') && (
                    <Dropdown
                        dismissOnClick={false}
                        renderTrigger={() => <span><BsThreeDotsVertical /></span>}
                    >
                        {!isValidating && (
                            <Dropdown.Item onClick={() => handleToggleServiceStatus(servicio.id, servicio.id_estatus)}>
                                <div className="flex items-center">
                                    {isServiceActive ? <LuPowerOff className="w-10 h-5 mr-2" /> : <FaCheck />}
                                    {isServiceActive ? 'Desactivar publicación' : 'Activar publicación'}
                                </div>
                            </Dropdown.Item>
                        )}
                        {sessionStorage.getItem("tu") === "1" && (
                            <Dropdown.Item onClick={() => handleDeletePublication(servicio.id)}>
                                <div className="flex items-center">
                                    <FaTrash className="w-10 h-5 mr-1" />
                                    Eliminar solicitud
                                </div>
                            </Dropdown.Item>
                        )}
                    </Dropdown>
                )}
            </div>

            <div className="h-56 sm:h-64 xl:h-40 2xl:h-44 mb-5">
                <Carousel leftControl rightControl>
                    {servicio.imagenes.map((imagen, index) => (
                        <img
                            key={index}
                            src={`data:image/jpeg;base64,${imagen.archivo}`}
                            alt={servicio.detalle_servicio.titulo}
                        />
                    ))}
                </Carousel>
            </div>

            <p className="font-bold mb-3 text-gray-700 uppercase">
                Título: <span className="font-normal normal-case">{servicio.detalle_servicio.titulo}</span>
            </p>
            <p className="font-bold mb-3 text-gray-700 uppercase">
                Servicio: <span className="font-normal normal-case">{servicio.tipo_servicio.servicio}</span>
            </p>
            <p className="font-bold mb-3 text-gray-700 uppercase">
                Pueblo Mágico: <span className="font-normal normal-case">{servicio.pueblo.nombre}</span>
            </p>
            <div className="flex">
                <p className="flex font-bold gap-3 text-gray-700 uppercase">
                    Estado: {' '}
                    <Badge
                        color={
                            servicio.estatus.id === 1 ? 'warning'
                                : servicio.estatus.id === 2 ? 'success'
                                    : servicio.estatus.id === 3 ? 'failure'
                                        : 'gray'
                        }
                        className="h-auto"
                    >
                        {servicio.estatus.estado}
                    </Badge>
                </p>
            </div>
            <p
                className="text-center cursor-pointer underline mt-10"
                onClick={() => handleCardClick(servicio.id, servicio.estatus.id !== 4)}
            >
                {servicio.estatus.id === 4 ? 'Editar' : 'Ver mas...'}
            </p>
        </div>
    );
};

export default ServicioCard;