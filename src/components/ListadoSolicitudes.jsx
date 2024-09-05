import ReactPaginate from "react-paginate";
import React, { useEffect, useState, useCallback } from 'react'
import { Carousel, Spinner, Modal, Tooltip, Badge, Dropdown } from "flowbite-react"
import '../index.css'
import ModalSolicitud from './ModalSolicitud'
import NoDataCard from './NoDataCard';
import { HiCheckCircle, HiOutlinePencilAlt, HiXCircle } from "react-icons/hi";
import { FaTrash, FaCheck } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuPowerOff } from "react-icons/lu";
import FormData from 'form-data';
import Swal from 'sweetalert2';
import EditServiceModal from "./EditServiceModal";
import { getAllServices, getServicesFiltered, fetchAccept, fetchObservations, fetchDeleteService, fetchUpdateImages, fetchUpdateService } from '../api/api'

function ListadoSolicitudes({ tipoSolicitud }) {
    const [servicios, setServicios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [openModalControl, setOpenModalControl] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [emptyData, setEmptyData] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [isServiceActive, setIsServiceActive] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
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
        case '4':
            titulo = 'Solicitudes inactivas';
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
            setServicios([]); // Limpiar los servicios antes de cargar nuevos datos
            const { data, last_page } = await getFilteredData(tipoSolicitud, currentPage);
            setServicios(data || []);
            setTotalPages(last_page);
            setEmptyData((data || []).length === 0 || last_page === 0);
        } catch (e) {
            console.error('Error fetching data: ', e);
            setEmptyData(true);
        } finally {
            setIsLoading(false);
        }
    }

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    })

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

        try {
            let response;
            if (id_estatus === 'all') {
                response = await getAllServices(page);
            } else {
                response = await getServicesFiltered(id_estatus, page);
            }

            const data = response.data.data.servicios;
            const totalPages = data.last_page;
            const currentPage = data.current_page;

            // Si la página solicitada es mayor que el número total de páginas, establece la página a la última disponible
            const adjustedPage = currentPage > totalPages ? totalPages : currentPage;
            
            if (adjustedPage !== currentPage) {
                page = adjustedPage - 1;

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
                const data = await response.json()
                if (data.data && data.data.error) {
                    // Si hay un error en la respuesta, lanzamos una excepción
                    throw new Error(data.error);
                }
                Swal.fire({
                    icon: "success",
                    title: "Ok",
                    text: "La publicación fue aceptada con éxito"
                });
                fetchData();
                setOpenModal(false);

            } else {
                throw new Error("Error en la solicitud");
            }
        } catch (error) {
            let errorMessage = "Ocurrió un error inesperado";

            if (error.response.data.data) {
                errorMessage = error.response.data.data.error || errorMessage;
            }

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage
            });
        }
    }

    const handleToggleServiceStatus = async (id, estatus) => {

        if (estatus === 1 || estatus === 2) {
            /*                 Swal.fire({
                                title: 'Error',
                                text: 'No es posible desactivar la publicación hasta que esta sea aceptada.',
                                icon: 'error',
                                timer: 10000
                            }); */
            setIsServiceActive(true)
            await desactivateService(id);
            setIsEditable(true);
            setIsPaused(true);
        } else if (estatus === 4) {
            setIsServiceActive(false)
            await activateServiceFlow(id);
        }
    }

    const desactivateService = async (id) => {

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas pausar la publicación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6C1D45',
            confirmButtonText: 'Sí, pausar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                const dataToSend = {
                    data: {
                        servicio: {
                            id_estatus: 4
                        }
                    },
                };
                const response = await fetchAccept(id, dataToSend);
                if (response.status === 200) {
                    Swal.fire('Éxito', 'La publicación fue pausada', 'success');
                    setIsServiceActive(false);
                    fetchData();
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Ocurrió un error al pausar la publicación',
                    timer: 5000
                });
            }
        }
    }

    const activateServiceFlow = async (id) => {
        setOpenModalControl(true)
        setSelectedServiceId(id);
        setIsEditable(true);
        //setIsModalOpen(true);
    }

    const updateService = async (id, updatedFields) => {
        try {
            const response = await fetchUpdateService(id, updatedFields)
            return response;
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            throw error;
        }
    }

    const handleSaveAndActivate = async (id, data, newimage, newImageGallery) => {
        const dataToUpdate = {
            data: {
                servicio: {},
                servicio_detalles: {},
                coordenadas: {},
                horarios: {},
                direccion: {}
            }
        };
        const serviceId = id;

        // Mapeo de los campos a sus respectivas secciones
        const fieldMapping = {
            id_categoria: ['servicio', 'id_tipo_servicio'],
            id_pueblo: ['servicio', 'id_pueblo'],
            dias_servicio: ['servicio_detalles', 'dias_servicio'],
            precios: ['servicio_detalles', 'precios'],
            titulo: ['servicio_detalles', 'titulo'],
            descripcion: ['servicio_detalles', 'descripcion'],
            telefono: ['servicio_detalles', 'telefono'],
            pagina_web: ['servicio_detalles', 'pagina_web'],
            longitud: ['coordenadas', 'longitud'],
            latitud: ['coordenadas', 'latitud'],
            horario_inicio: ['horarios', 'horario_inicio'],
            horario_fin: ['horarios', 'horario_fin'],
            calle: ['direccion', 'calle'],
            municipio: ['direccion', 'municipio'],
            CP: ['direccion', 'CP'],
            int: ['direccion', 'int'],
            ext: ['direccion', 'ext'],
            colonia: ['direccion', 'colonia']
        };

        // Agregar solo los campos modificados
        Object.keys(data).forEach(key => {
            if (fieldMapping[key]) {
                const [section, field] = fieldMapping[key];
                dataToUpdate.data[section][field] = data[key];
            }
        });

        // Agregar campos fijos
        dataToUpdate.data.servicio.id_usuario = localStorage.getItem("user_name");
        dataToUpdate.data.servicio.id_estatus = 1;

        // Eliminar secciones vacías
        Object.keys(dataToUpdate.data).forEach(key => {
            if (Object.keys(dataToUpdate.data[key]).length === 0) {
                delete dataToUpdate.data[key];
            }
        });

        try {
            if (newimage) {
                const file = dataToUpdate.imagen_principal;
                try {
                    const formData = new FormData();
                    formData.append('data[imagen_principal]', file);
                    formData.append('data[servicio][id_estatus]', 1)
                    formData.append('_method', 'PUT');

                    const response = await fetchUpdateImages(serviceId, formData)
                    if (response.status === 200) {
                        Toast.fire({
                            icon: "success",
                            title: "Se ha cargado la imagen exitosamente"
                        });
                    }

                } catch (error) {
                    Swal.fire('Error', 'No se pudo cargar la imagen', 'error')
                    throw error;
                }
            } else if (newImageGallery) {
                const formDataGallery = new FormData();
                for (const file of data.imagenes_nuevas) {
                    formDataGallery.append('data[imagenes_nuevas][]', file);

                }
                formDataGallery.append('data[servicio][id_estatus]', 1)
                formDataGallery.append('_method', 'PUT');
                try {
                    const response = await fetchUpdateImages(serviceId, formDataGallery)
                    if (response.status === 200) {
                        Toast.fire({
                            icon: "success",
                            title: "Se han cargado las imagenes exitosamente"
                        });
                    }
                } catch (error) {
                    Swal.fire('Error', 'No se pudieron cargar las imagenes', 'error');
                    throw error;
                }
            } else {
                const idServicio = id
                try {
                    const response = await updateService(idServicio, dataToUpdate);
                    if (response.status === 200) {
                        Toast.fire({
                            icon: "success",
                            title: "Se han actualizado la información exitosamente"
                        });
                    }
                } catch (error) {
                    Swal.fire('Error', 'No fue posible actualizar la información', 'error')
                    throw error;
                }
            }
            const dataToSend = {
                data: {
                    servicio: {
                        id_estatus: 1
                    }
                },
            }
            const response = await fetchAccept(id, dataToSend);
            if (response.status === 200) {
                Swal.fire('Éxito', 'Publicación enviada. Pendiente de validación', 'success');
                setIsServiceActive(true);
                fetchData();
            }
        } catch (error) {

            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Ocurrió un error al activar la publicación',
                timer: 5000
            });
        }
    }

    const handleDeletePublication = async (id) => {

        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas eliminar la publicación?',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#6C1D45',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });
            if (result.isConfirmed) {
                const response = await fetchDeleteService(id);
                if (response.status === 200) {
                    Swal.fire('Éxito', 'La publicación fue eliminada', 'success');
                    setIsServiceActive(!isServiceActive);
                    setIsValidating(true);
                    fetchData();
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Ocurrió un error al eliminar la publicación',
                timer: 5000
            });
        }
    }

    const handlePageClick = (event) => {
        const newPage = event.selected;
        setCurrentPage(newPage);
    }



    const handleCardClick = (id, isActive) => {
        setSelectedServiceId(id);
        if (isActive) {
            setOpenModal(true);
        } else {
            setIsModalOpen(true);
        }

    }

    const handleCardClickActive = (id, isActive) => {
        setSelectedServiceId(id);
        if (isActive != 4) {
            setIsServiceActive(true)
        } else {
            setIsServiceActive(false)
        }
    }

    const handleModalClose = () => {
        if (openModal) {
            setIsEditable(false);
            setOpenModal(false);
            setSelectedServiceId(null);
        }
        setOpenModalControl(false)
    }
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
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al enviar las observaciones"
                });
                throw error;
            }
        }
    }

    const handleSaveEdit = () => {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Tu publicacion fue enviada a validación con éxito',
        });

        setOpenModalControl(false)
    }
    const handleShowEdit = () => {
        setOpenModal(true)
    }
    const handleCancelEdit = () => {
        setOpenModalControl(false)
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
                        className="relative m-3 bg-white shadow-md px-5 py-6 rounded-xl"
                    >
                        <div className="absolute top-4 right-0.5 cursor-pointer" onClick={() => handleCardClickActive(servicio.id, servicio.id_estatus)}>
                            {(!isValidating || sessionStorage.getItem('tu') === '1') && (
                                <Dropdown
                                    dismissOnClick={false}
                                    renderTrigger={() => <span><BsThreeDotsVertical /></span>}

                                >
                                    {!isValidating && (
                                        <Dropdown.Item onClick={() => /* setOpenModalControl(true) */ handleToggleServiceStatus(servicio.id, servicio.id_estatus)}>
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
                            onClick={() => handleCardClick(servicio.id, servicio.estatus.id !== 4)}
                        >
                            {
                                servicio.estatus.id === 4 ? 'Editar'
                                    : 'Ver mas...'
                            }
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
                    activeClassName="active"
                />
            </div>

            <Modal show={openModal} onClose={handleModalClose}>
                <Modal.Header>Publicación</Modal.Header>
                <Modal.Body >
                    <ModalSolicitud
                        serviceId={selectedServiceId}
                        isEditable={isEditable}
                        isPaused={isPaused}
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

            <Modal show={openModalControl} onClose={handleModalClose}>
                <Modal.Body>
                    {/*                     {Swal.fire({
                        icon: 'warning',
                        text: '¿Estás seguro de continuar? ya que si no has guardado cambios en la información, estos se perderan',
                        
                    })} */}
                    <h4>¿Estás seguro de continuar, ya que si no has guardado cambios en la información, estos se perderán?</h4>
                    <div className='flex gap-4 mt-10'>
                        <button type="button" className="p-1 bg-slate-200 rounded-md" onClick={handleSaveEdit}>Guardar</button>
                        {/* <button type="button" className="p-1 bg-lime-500 rounded-md" onClick={handleShowEdit}>Editar</button> */}
                        <button type="button" className="p-1 bg-red-500 rounded-md" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                </Modal.Body>
            </Modal>

            <EditServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceId={selectedServiceId}
                onDataUpdate={handleDataUpdate}
                onSaveAndActivate={handleSaveAndActivate}
            />
        </>
    )
}

export default ListadoSolicitudes
