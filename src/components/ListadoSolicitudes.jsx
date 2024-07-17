
import axios from "axios"
import ReactPaginate from "react-paginate";
import React, { useEffect, useState } from 'react'
import { Carousel, Spinner, Modal, Tooltip, Badge } from "flowbite-react"
import '../index.css'
import ModalSolicitud from './ModalSolicitud'
import NoDataCard from './NoDataCard';
import { HiCheckCircle, HiOutlinePencilAlt, HiXCircle } from "react-icons/hi";
import FormData from 'form-data';
import Swal from 'sweetalert2';
import { getAllServices, getServicesFiltered, fetchAccept, fetchObservations } from '../api/api'

function ListadoSolicitudes({ tipoSolicitud }) {
    const [servicios, setServicios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [emptyData, setEmptyData] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    let titulo;

    switch (tipoSolicitud) {
        case 'all':
            titulo = 'Todas las solicitudes';
            break;
        case '1':
            titulo = 'Solicitudes pendientes';
            break;
        case '2':
            titulo = 'Solicitudes aceptadas';
            break;
        case '3':
            titulo = 'Solicitudes con observación';
            break;
        default:
            titulo = 'Título predeterminado';
            break;
    }

    useEffect(() => {
        fetchData();
    }, [currentPage, tipoSolicitud]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const { data, last_page } = await getFilteredData(tipoSolicitud, currentPage);
            const newServicios = data || [];
            setServicios(newServicios);
            setTotalPages(last_page);
            setEmptyData(newServicios.length === 0 || last_page === 0);
        } catch (e) {
            console.error('Error fetching data: ', e);
            setEmptyData(true);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDataUpdate = () => {
        fetchData();
        setIsEditable(false)
    }

    const handleVerifyObservations = (flag) => {
        if (flag) {
            setIsEditable(true)
        } else {
            setIsEditable(false)
        }

    }

    const getFilteredData = async (id_estatus, page) => {
        const token = sessionStorage.getItem('accessToken');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                page: page + 1
            }
        };

        try {
            let response;
            if (id_estatus === 'all') {
                response = await getAllServices(page);
            } else {
                response = await getServicesFiltered(id_estatus, page);
                /* response = await axios.get(`http://localhost/api/servicios/filtrar/estatus/${id_estatus}`, config); */
            }

            const data = response.data.data.servicios;
            const totalPages = data.last_page;
            const currentPage = data.current_page;

            // Si la página solicitada es mayor que el número total de páginas, establece la página a la última disponible
            const adjustedPage = currentPage > totalPages ? totalPages : currentPage;
            if (adjustedPage !== currentPage) {
                config.params.page = adjustedPage;

                // Realiza la solicitud con la página ajustada
                if (id_estatus === 'all') {
                    response = await getAllServices(page);
                } else {
                    response = await getServicesFiltered(id_estatus, page);
                }
            }
            return response.data.data.servicios;
        } catch (e) {
            throw e;
        }
    };
    const maxPageIndex = totalPages > 0 ? totalPages - 1 : 0;
    const clampedForcePage = Math.min(currentPage, maxPageIndex);

    const handleAccept = async () => {

        const dataToSend = {
            data: {
                servicio: {
                    id_estatus: "2"
                }
            }
        };
        try {

            const response = await fetchAccept(selectedServiceId, dataToSend)
            if (response.status === 200) {
                // La solicitud fue exitosa
                Swal.fire({
                    icon: "success",
                    title: "Ok",
                    text: "La publicación fue aceptada con éxito"
                });
                fetchData();
                setOpenModal(false);
            } else {
                // La solicitud no fue exitosa
                const errorMessage = response.data ? response.data.error : 'Ocurrió un error al aceptar la publicación';
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al intentar aceptar la publicación"
            });
        }
    }


    const handlePageClick = (event) => {
        const newPage = event.selected;
        setCurrentPage(newPage);
        fetchData();
    };

    const handleCardClick = (id) => {
        setSelectedServiceId(id);
        setOpenModal(true);
    };
    const handleModalClose = () => {
        if (openModal) {
            setIsEditable(false);
            setOpenModal(false);
            setSelectedServiceId(null);
        }
    };
    const handleEditable = () => {
        setIsEditable(true);
    }

    const handleReject = async () => {
        const { value: observaciones } = await Swal.fire({
            title: 'Rechazar solicitud',
            input: 'textarea',
            inputPlaceholder: 'Ingrese las observaciones...',
            showCancelButton: true,
            confirmButtonColor: '#6C1D45',
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Por favor, ingrese las observaciones';
                }
            }
        })
        if (observaciones) {
            const formData = new FormData();
            formData.append('data[id_servicio]', selectedServiceId);
            formData.append('data[id_usuario]', localStorage.getItem('user_name'));
            formData.append('data[observacion]', observaciones)
            try {
                const response = await fetchObservations(formData)
                if ((await response).status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Rechazada",
                        text: "Las observaciones fueron enviadas con éxito"
                    });
                    setOpenModal(false);
                    fetchData();
                } else {
                    throw new Error('Error al enviar las observaciones');
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al enviar las observaciones"
                });
                throw error;
            }
        }
    }

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
            <div className="mt-10 mx-5">
                <h2>{titulo}</h2>
            </div>
            <div>
                {emptyData && <NoDataCard />}
            </div>
            {/*Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
                                    className="h-auto">{servicio.estatus.estado}</Badge>
                            </p>
                        </div>
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
            <div className="mt-24">
                <ReactPaginate
                    breakLabel={'...'}
                    nextLabel="Siguiente"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={totalPages}
                    previousLabel="Anterior"
                    renderOnZeroPageCount={null}
                    className="pagination"
                    forcePage={clampedForcePage}
                />
            </div>

            <Modal show={openModal} onClose={handleModalClose}>
                <Modal.Header>Publicación</Modal.Header>
                <Modal.Body >
                    <ModalSolicitud
                        serviceId={selectedServiceId}
                        isEditable={isEditable}
                        onDataUpdate={handleDataUpdate}
                        verifyObservations={handleVerifyObservations}
                    />
                </Modal.Body>
                <Modal.Footer className="flex items-center justify-end gap-4">
                    <div className="flex flex-row-reverse gap-x-7">
                        {(sessionStorage.getItem("tu") === "1" || sessionStorage.getItem("tu") === "2") && (
                            <>
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
                                        onClick={handleEditable}
                                    >
                                        <HiOutlinePencilAlt />
                                    </button>
                                </Tooltip>
                                <Tooltip content="Rechazar publicación">
                                    <button
                                        type="button"
                                        className="py-3 px-3 bg-[#707372] hover:bg-[#8D9293] text-white rounded-full"
                                        onClick={handleReject}
                                    >
                                        <HiXCircle />
                                    </button>
                                </Tooltip>
                            </>
                        )}
                    </div>
                </Modal.Footer>

            </Modal>
        </>
    )
}

export default ListadoSolicitudes
