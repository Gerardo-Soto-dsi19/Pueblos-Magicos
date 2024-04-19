
import axios from "axios"
import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from 'react'
import { Carousel, Spinner, Modal, Tooltip } from "flowbite-react"
import '../index.css'
import ModalSolicitud from './ModalSolicitud'
import NoDataCard from './NoDataCard';
import { HiCheckCircle, HiOutlinePencilAlt, HiXCircle } from "react-icons/hi";

function ListadoSolicitudes({ tipoSolicitud }) {
    const [servicios, setServicios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [emptyData, setEmptyData] = useState(false);


    useEffect(() => {
        fetchData();
    }, [currentPage, tipoSolicitud]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await getFilteredData(tipoSolicitud, currentPage);

            if (data && data.data && data.data.length > 0) {
                setServicios(data.data);
                setTotalPages(data.last_page);
                setEmptyData(false)
            } else {
                setServicios([]);
                setTotalPages(0);
                setEmptyData(true)
                console.log('No se encontraron datos');
            }
        } catch (e) {
            console.error('Error fetching data: ', e);
        } finally {
            setIsLoading(false);
        }

    };
    const getFilteredData = async (id_estatus, page) => {
        try {
            const token = sessionStorage.getItem('accessToken');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    page: page + 1,
                }
            };
            if (id_estatus === 'all') {
                const response = await axios.get('http://localhost/api/servicios', config);
                return response.data.data.servicios;
            } else {
                const response = await axios.get(`http://localhost/api/servicios/filtrar/estatus/${id_estatus}`, config);
                return response.data.data.servicios;
            }
        } catch (e) {
            console.error('Error fetching data: ', e);
            throw e;
        }
    };

    const handleAccept = () => {
        console.log(selectedServiceId);
        const token = sessionStorage.getItem('accessToken')
        const dataToSend = {
            data: {
                servicio: {
                    id_estatus: "2"
                }
            }
        };
        try {
            axios.put(`http://localhost/api/servicios/${selectedServiceId}`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    '_method': 'put',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.log('Componente afectado:', response.data);
            })
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleCardClick = (id) => {
        setSelectedServiceId(id);
        setOpenModal(true);
    };
    const handleModalClose = () => {
        if (openModal) {
            setOpenModal(false);
            setSelectedServiceId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="lds-ring">
                    <Spinner className="spinner-custom" size="xl" />
                </div>
            </div>
        );
    }



    return (
        <>

            {/*Menú filtros tipo servicio */}
            <div className='md:flex flex-col my-5 px-2 '>
                <div className="bg-white md:flex gap-10 md:px-5 py-5 md:py-5 shadow-md rounded-md">
                    <div className="flex items-center gap-x-3">
                        <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-[#5A1236]"
                        />
                        <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                            Pueblo Magico
                        </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <input
                            id="push-email"
                            name="push-notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-[#5A1236]"
                        />
                        <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                            Sector Hotelero
                        </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-[#5A1236]"
                        />
                        <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                            Sector Restaurantero
                        </label>
                    </div>

                </div>
            </div >
            <div>
                {/* Renderiza tus otros componentes */}
                {emptyData && <NoDataCard />}
            </div>
            {/*Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {servicios.map((servicio) => (
                    <div
                        key={servicio.id}
                        className="m-3 bg-white shadow-md px-5 py-6 rounded-xl"
                    >
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
                            Título:{' '}
                            <span className="font-normal normal-case">
                                {servicio.detalle_servicio.titulo}
                            </span>
                        </p>
                        <p className="font-bold mb-3 text-gray-700 uppercase">
                            Servicio:{' '}

                            <span className="font-normal normal-case">{servicio.tipo_servicio.servicio}</span>
                        </p>
                        <p className="font-bold mb-3 text-gray-700 uppercase">
                            Pueblo Mágico:{' '}
                            <span className="font-normal normal-case">{servicio.pueblo.nombre}</span>
                        </p>
                        <p
                            className=" text-center cursor-pointer underline mt-10"
                            onClick={() => handleCardClick(servicio.id)}
                        >
                            Ver más...
                        </p>
                    </div>
                ))}
            </div>
            {/*Pagination*/}
            <div className="mt-10">
                <ReactPaginate
                    breakLabel={'...'}
                    previousLabel={'Anterior'}
                    nextLabel={'Siguiente'}
                    pageCount={totalPages}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    pageLinkClassName={'page-num'}
                    previousLinkClassName={'page-num'}
                    nextLinkClassName={'page-num'}
                    activeLinkClassName={'active'}
                />
            </div>

            <Modal show={openModal} onClose={handleModalClose}>
                <Modal.Header>Publicación</Modal.Header>
                <Modal.Body >
                    <ModalSolicitud
                        serviceId={selectedServiceId}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex float-end gap-4">
                        <Tooltip content="Aceptar publicación">
                            <button
                                type="button"
                                className="md:flex-1 py-3 px-3 bg-[#6C1D45] hover:bg-[#8C3A68] text-white rounded-full"
                                onClick={handleAccept}
                            >
                                <HiCheckCircle />
                            </button>
                        </Tooltip>
                        <Tooltip content="Editar publicación">
                            <button
                                type="button"
                                className="md:flex-1 py-3 px-3  bg-slate-950 hover:bg-slate-800 text-white rounded-full"
                            >
                                <HiOutlinePencilAlt />
                            </button>
                        </Tooltip>
                        <Tooltip content="Rechazar publicación">
                            <button
                                type="button"
                                className="py-3 px-3 bg-[#707372] hover:bg-[#8D9293] text-white rounded-full"
                            >
                                <HiXCircle />
                            </button>
                        </Tooltip>

                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ListadoSolicitudes
