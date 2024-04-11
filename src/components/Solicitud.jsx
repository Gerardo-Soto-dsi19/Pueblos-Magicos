import { useState } from "react";
import { Carousel, Modal, Button } from "flowbite-react"
import Formulario from "../pages/Formulario";
function Solicitud() {
    const [openModal, setOpenModal] = useState(false);
    return (
        <>
            <div className='m-3 bg-white shadow-md px-5 py-6 rounded-xl'>
                <div className="h-56 sm:h-64 xl:h-40 2xl:h-44 mb-5">
                    <Carousel>
                        <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
                    </Carousel>
                </div>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Título: {''}
                    <span className='font-normal normal-case'>Barcelo</span>
                </p>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Servício: {''}
                    <span className='font-normal normal-case'>Sector Hotelero</span>
                </p>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Pueblo Mágico: {''}
                    <span className='font-normal normal-case'>Cholula</span>
                </p>
                <p className=' text-center cursor-pointer underline mt-10' onClick={() => setOpenModal(true)} >
                    Ver mas...
                </p>
              
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Publicación</Modal.Header>
                <Modal.Body className="bg-[#F4F4F4]">
                    <Formulario/>
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
