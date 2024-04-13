import { useState } from "react";
import React from 'react';
import { Carousel, Modal } from "flowbite-react"
import ModalSolicitud from "./ModalSolicitud";
function Solicitud(servicio) {
    const [openModal, setOpenModal] = useState(false);
    if (!servicio || !servicio.detalle_servicio || !servicio.pueblo || !servicio.imagenes) {
        return null; // Retorna null si alguno de los datos necesarios no está disponible
    }
    return (
        <>
            <div className="m-3 bg-white shadow-md px-5 py-6 rounded-xl">
                <div className="h-56 sm:h-64 xl:h-40 2xl:h-44 mb-5">
                    {servicio.imagenes.length > 0 && (
                        <Carousel leftControl rightControl>
                            {servicio.imagenes.map((imagen, index) => (
                                <img
                                    key={index}
                                    src={`data:image/jpeg;base64,${imagen.archivo}`}
                                    alt={servicio.detalle_servicio.titulo}
                                />
                            ))}
                        </Carousel>
                    )}
                </div>
                <p className="font-bold mb-3 text-gray-700 uppercase">
                    Título: <span className="font-normal normal-case">{servicio.detalle_servicio.titulo}</span>
                </p>
                <p className="font-bold mb-3 text-gray-700 uppercase">
                    Servicio: <span className="font-normal normal-case">Sector Hotelero</span>
                </p>
                <p className="font-bold mb-3 text-gray-700 uppercase">
                    Pueblo Mágico: <span className="font-normal normal-case">{servicio.pueblo.nombre}</span>
                </p>
                <p className=" text-center cursor-pointer underline mt-10" onClick={() => setOpenModal(true)}>
                    Ver más...
                </p>
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Publicación</Modal.Header>
                <Modal.Body >
                    <ModalSolicitud
                        value={'Barcelo'} />
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-between mt-10 flex-wrap gap-4">
                        <button
                            type="button"
                            className="md:flex-1 py-2 px-6 md:px-10 bg-[#6C1D45] hover:bg-[#8C3A68] text-white font-bold uppercase rounded-lg mb-4"
                        >
                            Aceptar
                        </button>
                        <button
                            type="button"
                            className="md:flex-1 py-2 px-6 md:px-10 bg-slate-950 hover:bg-slate-800 text-white font-bold uppercase rounded-lg mb-4"
                        >
                            Editar
                        </button>
                        <button
                            type="button"
                            className="md:flex-1 py-2 px-6 md:px-10 bg-[#707372] hover:bg-[#8D9293] text-white font-bold uppercase rounded-lg mb-4"
                        >
                            Rechazar
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default Solicitud
