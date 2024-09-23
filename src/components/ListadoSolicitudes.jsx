import ReactPaginate from "react-paginate";
import React, { useEffect, useState, useCallback } from 'react'
import { Spinner, Modal, Tooltip } from "flowbite-react"
import '../index.css'
import ModalSolicitud from './ModalSolicitud'
import NoDataCard from './NoDataCard';
import { HiCheckCircle, HiOutlinePencilAlt, HiXCircle } from "react-icons/hi";
import FormData from 'form-data';
import Swal from 'sweetalert2';
import EditServiceModal from "./EditServiceModal";
import BuscadorPublicaciones from "./BuscadorPublicaciones";
import ServiceCard from "./ServiceCard";
import { getAllServices, getServicesFiltered, fetchAccept, fetchObservations, fetchDeleteService, fetchUpdateImages, fetchUpdateService, fetchSearchResultsFiltered } from '../api/api'

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
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

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
            titulo = '';
            break;
    }
    useEffect(() => {
        if (!isSearching) {
            fetchFilteredData();
        }
    }, [tipoSolicitud, currentPage, isSearching]);

    const fetchFilteredData = async () => {
        try {
            setIsLoading(true);
            setServicios([]);
            const { data, last_page } = await getFilteredData(tipoSolicitud, currentPage);
            console.log('Resultado del response de getFilteredData', data);
            setServicios(data || []);
            setTotalPages(last_page);
            setFilteredServices(data || []);
            setEmptyData((data || []).length === 0 || last_page === 0);
        } catch (e) {
            console.error('Error fetching filtered data: ', e);
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
        fetchFilteredData();
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

    const handleApplyFilter = async (filtros) => {
        try {
            setIsLoading(true);
            setIsSearching(true);
            const response = await fetchSearchResultsFiltered(filtros);
            setSearchResults(response.data.data.servicios.data || []);
            setEmptyData(response.data.data.servicios.data.length === 0);
            setTotalPages(response.data.data.servicios.last_page)
            setCurrentPage(response.data.data.servicios.current_page)
        } catch (e) {
            console.error('Error in search: ', e);
            setEmptyData(true);
        } finally {
            setIsLoading(false);
        }
    }

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
                fetchFilteredData();
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
                    fetchFilteredData();
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
                fetchFilteredData();
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
                    fetchFilteredData();
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
                    fetchFilteredData();
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

    const handleSaveEdit = async () => {
        console.log('Entra a la funcion');
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('data[servicio][id_estatus]', 1)
            formData.append('_method', 'PUT');
            const response = await fetchAccept(selectedServiceId, formData)
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Tu publicacion fue enviada a validación con éxito',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Ocurrió un error al activar la publicación',
                timer: 5000
            });
        } finally {
            setIsLoading(false)
            fetchFilteredData();
        }

        setOpenModalControl(false)
    }
    const handleShowEdit = () => {
        setOpenModal(true)
    }
    const handleCancelEdit = () => {
        setOpenModalControl(false)
    }

    const clearSearch = () => {
        setIsSearching(false);
        setSearchResults([]);
        fetchFilteredData(); // Esta función carga los datos originales
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
                <BuscadorPublicaciones
                    onSearchResult={handleApplyFilter}
                    onClearSearch={clearSearch}
                />
                {isSearching && (
                    <div className="mt-5 bg-[#F5E1EC] border-l-4 border-[#6C1D45] text-[#6C1D45] p-4 mb-4 flex justify-between items-center" role="alert">
                        <p className="font-medium">Mostrando resultados de búsqueda.</p>
                        <button
                            onClick={clearSearch}
                            className="px-4 py-2 bg-[#6C1D45] text-white rounded-md hover:bg-[#8C3A68] transition duration-300 ease-in-out"
                        >
                            Volver a todos los servicios
                        </button>
                    </div>
                )}
            </div>
            <div>
                {emptyData && <NoDataCard />}
            </div>
            {/*Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {isSearching
                    ? searchResults.map((servicio) => (

                        <ServiceCard
                            key={servicio.id}
                            servicio={servicio}
                            isValidating={isValidating}
                            handleCardClickActive={handleCardClickActive}
                            handleToggleServiceStatus={handleToggleServiceStatus}
                            handleDeletePublication={handleDeletePublication}
                            handleCardClick={handleCardClick}
                        />
                    ))
                    : filteredServices.map((servicio) => (
                        <ServiceCard
                            key={servicio.id}
                            servicio={servicio}
                            isValidating={isValidating}
                            handleCardClickActive={handleCardClickActive}
                            handleToggleServiceStatus={handleToggleServiceStatus}
                            handleDeletePublication={handleDeletePublication}
                            handleCardClick={handleCardClick}
                        />
                    ))
                }
            </div >
            {/*Pagination*/}
            <div div className="mt-24" >
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
            </div >

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
                <Modal.Body className="m-5" >
                    <h2 className="text-center">¡Atención!</h2><br />
                    <h4 className="text-center">Está a punto de activar esta publicación.</h4><br />
                    <p className="text-center"> Recuerde: Si no ha realizado modificaciones a la información,</p>
                    <p className="text-center">deberá repetir el proceso completo de edición posteriormente.</p><br />
                    <h3 className="text-center">¿Desea continuar con la activación?</h3>
                    <div className='flex justify-center gap-4 mt-10'>
                        <button
                            type="button"
                            className="px-4 py-2 bg-[#6C1D45] text-white rounded-md hover:bg-[#8C3A68]"
                            onClick={handleSaveEdit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner className='spinner-custom' aria-label="Spinner de carga" />
                            ) : (
                                'Aceptar'
                            )}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-[#707372] text-white rounded-md hover:bg-[#8C8F8E]"
                            onClick={handleCancelEdit}>Cancelar
                        </button>
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
