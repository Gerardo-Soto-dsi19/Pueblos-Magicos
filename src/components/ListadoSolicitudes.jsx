
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

function ListadoSolicitudes({ tipoSolicitud }) {
    const [servicios, setServicios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [emptyData, setEmptyData] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    useEffect(() => {
        fetchData();
    }, [currentPage, tipoSolicitud]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await getFilteredData(tipoSolicitud, currentPage);
            const newServicios = data.data || [];
            setServicios(newServicios);
            setTotalPages(data.last_page);
            setEmptyData(newServicios.length === 0); // Actualiza emptyData directamente
        } catch (e) {
            console.error('Error fetching data: ', e);
            setEmptyData(true); // Si hay un error, establece emptyData a true
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
            throw e;
        }
    };

    const handleAccept = () => {
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
        setCurrentPage((event.selected));
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
            const token = sessionStorage.getItem('accessToken');

            const _form_data_ = new FormData();

            _form_data_.append('data[id_servicio]', selectedServiceId);
            _form_data_.append('data[id_usuario]', localStorage.getItem('user_name'));
            _form_data_.append('data[observacion]', observaciones)
            try {
                const _response_ = axios.post('http://localhost/api/observaciones', _form_data_, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });
                Swal.fire({
                    icon: "success",
                    title: "Ok",
                    text: "Las observaciones fueron enviadas con exito"
                });
                throw _response_
            } catch (error) {
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
            {/*Menú filtros tipo servicio */}
            <div className='md:flex flex-col my-5 px-2'>
                <div className="md:flex flex-col bg-white md:gap-4 px-5 py-5 shadow-md rounded-md">
                    <div >
                        <h3 className="md:flex flex-col border-b-2">Ordenar por:</h3>
                    </div>
                    <div className="md:flex items-center gap-10">
                        <div className="flex items-center gap-x-3 md:mt-1 sm:mt-5">
                            <input
                                id="servicio_hotelero"
                                name="push-notifications"
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5A1236]"
                                
                            />
                            <label htmlFor="servicio_hotelero" className="block text-sm font-medium leading-6 text-gray-900">
                            Sector Hotelero
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3 sm:mt-2">
                            <input
                                id="servicio_restaurantero"
                                name="push-notifications"
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5A1236]"
                            />
                            <label htmlFor="servicio_restaurantero" className="block text-sm font-medium leading-6 text-gray-900">
                            Sector Restaurantero
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3 sm:mt-2">
                            <input
                                id="servicio_restaurantero"
                                name="push-notifications"
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5A1236]"
                            />
                            <label htmlFor="servicio_" className="block text-sm font-medium leading-6 text-gray-900">
                                Sector Tours
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3 sm:mt-2">
                            <input
                                id="servicio_festividades"
                                name="push-notifications"
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5A1236]"
                            />
                            <label htmlFor="servicio_" className="block text-sm font-medium leading-6 text-gray-900">
                                Sector Sitios
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3 sm:mt-2">
                            <input
                                id="servicio_festividades"
                                name="push-notifications"
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5A1236]"
                            />
                            <label htmlFor="servicio_" className="block text-sm font-medium leading-6 text-gray-900">
                                Festividades
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3 sm:mt-2">
                            <input
                                id="servicio_festividades"
                                name="push-notifications"
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5A1236]"
                            />
                            <label htmlFor="servicio_" className="block text-sm font-medium leading-6 text-gray-900">
                                Sector Sitios
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3 sm:mt-2">
                            <input
                                id="servicio_festividades"
                                name="push-notifications"
                                type="radio"
                                className="form-radio h-4 w-4 text-[#5A1236]"
                            />
                            <label htmlFor="servicio_" className="block text-sm font-medium leading-6 text-gray-900">
                                Sector Cerca de ustedes
                            </label>
                        </div>
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
            <div className="mt-10">
                <ReactPaginate
                    breakLabel={'...'}
                    nextLabel="Siguiente"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={totalPages}
                    previousLabel="Anterior"
                    renderOnZeroPageCount={null}
                    className="pagination"
                />
            </div>

            <Modal show={openModal} onClose={handleModalClose}>
                <Modal.Header>Publicación</Modal.Header>
                <Modal.Body >
                    <ModalSolicitud
                        serviceId={selectedServiceId}
                        isEditable={isEditable}
                    />
                </Modal.Body>
                <Modal.Footer className="flex items-center justify-end gap-4">
                    <div className="flex flex-row-reverse gap-x-7">
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

                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ListadoSolicitudes
