import { useEffect, useState } from 'react';
import { TextInput, Textarea, Label, Tooltip, Spinner } from "flowbite-react"
import { MdDataSaverOn } from "react-icons/md";
import { HiX } from "react-icons/hi";
import axios from 'axios';
import Swal from 'sweetalert2';
import React from 'react';
import FormData from 'form-data';
import { fetchRemoveMainImage, getTypesServices, getMagicTowns, getStateCatalogue, fetchGetServicioById, fetchUpdateService, fetchUpdateImages } from '../api/api'

function ModalSolicitud({ serviceId, isEditable, onDataUpdate }) {
    const [puebloMagico, setPuebloMagico] = useState([])
    const [categoria, setCategoria] = useState([])
    const [estado, setEstado] = useState([])
    const [serviceData, setServiceData] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [imageData, setImageData] = useState([]);
    const [imagesDataGallery, setImagesDataGallery] = useState([]);
    const [initialValues, setInitialValues] = useState({});
    const [formValues, setFormValues] = useState(initialValues);
    const [newimage, setNewImage] = useState(false);
    const [newImageGallery, setNewImageGallery] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


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
    });

    const handleMainImageUpload = (event) => {
        const { files } = event.target;
        if (!isEditable) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Debes elegir la opción editar publicación para cargar una nueva imagen"
            });
        }
        else if (imageData != null) {
            setNewImage(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puedes cargar dos imagenes de perfil"
            });
        } else {
            const file = event.target.files[0];
            setMainImage(file);
            setNewImage(true);

            setFormValues((prevState) => ({
                ...prevState,
                imagen_principal: files[0],
            }));
        }
    };

    const handleGalleryImageUpload = (event) => {
        const files = event.target.files;
        if (!isEditable) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Debes elegir la opción editar publicación para cargar una nueva imagen"
            });
        } else {
            setNewImageGallery(true);
            setGalleryImages([...galleryImages, ...Array.from(files)]);
            setFormValues((prevState) => ({
                ...prevState,
                imagenes_nuevas: Array.from(files),
            }));
        }

    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDropMainImage = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            if (Array.isArray(imageData) && imageData.length > 0) { // Verifica si el array imageData está vacío
                // Si ya hay una imagen principal existente, mostrar un mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No puedes cargar dos imágenes de perfil',
                });
            } else {
                // Si no hay una imagen principal existente, permitir soltar la nueva imagen
                setMainImage(files[0]);
                setNewImage(true);
                setFormValues((prevState) => ({
                    ...prevState,
                    imagen_principal: files[0],
                }));
            }
        }
    };

    const handleDropGalleryImages = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setNewImageGallery(true);
            setGalleryImages([...galleryImages, ...Array.from(files)]);
            setFormValues((prevState) => ({
                ...prevState,
                imagenes_nuevas: Array.from(files),
            }));
        }
    };

    const handleRemoveMainImage = () => {

        setMainImage(null);
    };

    const handleRemoveGalleryImages = () => {
        setGalleryImages([])
    }

    const handleRemoveDataMainImage = (_id_, _name_, _tipo_img_) => {

        const imageDataToDelete = {
            data: {
                imagenes_eliminar: [
                    {
                        id: _id_,
                        nombre: _name_
                    }
                ]
            }
        };
        try {
            fetchRemoveMainImage(imageDataToDelete, serviceId)
                .then(_response_ => {
                    if (_tipo_img_ === 1) {
                        setImageData(prevImages => {
                            if (Array.isArray(prevImages)) {
                                return prevImages.filter(image => image.id !== _id_);
                            } else {
                                return [];
                            }
                        });
                    } else {
                        setImagesDataGallery(prevImages => {
                            if (Array.isArray(prevImages)) {
                                return prevImages.filter(image => image.id !== _id_);
                            } else {
                                return [];
                            }
                        });
                    }
                    onDataUpdate();
                })
        } catch (error) {
            console.error('Error:', error);

        }
    }

    /* Seteo de combos  */
    useEffect(() => {
        getTypesServices()
            .then(response => {
                setCategoria(response.data.data)
            })
            .catch(error => {
                console.error('Error fetching states:', error);
            });
    }, []);


    useEffect(() => {
        getMagicTowns()
            .then(response => { setPuebloMagico(response.data.data) })
            .catch(error => {
                console.error('Error fetching pueblos:', error);
            });
    }, []);

    useEffect(() => {
        getStateCatalogue()
            .then(response => { setEstado(response.data.data) })
            .catch(error => {
                console.error('Error fetching estados:', error);
            });
    }, []);



    /* Seteo de informacion en inputs */
    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await fetchGetServicioById(serviceId)
                const serviceData = response.data.data.servicio[0];
                if (serviceData) {
                    const newInitialValues = {
                        id_pueblo: serviceData?.pueblo?.id || '',
                        pueblo: serviceData?.pueblo?.nombre || '',
                        id_categoria: serviceData?.tipo_servicio?.id || '',
                        categoria: serviceData?.tipo_servicio?.servicio || '',
                        titulo: serviceData.detalle_servicio?.titulo || '',
                        descripcion: serviceData.detalle_servicio?.descripcion || '',
                        dias_servicio: serviceData.detalle_servicio?.dias_servicio || '',
                        horario_inicio: serviceData.detalle_servicio?.horario.horario_inicio || '',
                        horario_fin: serviceData.detalle_servicio?.horario.horario_fin || '',
                        precios: serviceData.detalle_servicio?.precios || '',
                        latitud: serviceData.detalle_servicio?.coordenada.latitud || '',
                        longitud: serviceData.detalle_servicio?.coordenada.longitud || '',
                        calle: serviceData.direccion?.calle || '',
                        colonia: serviceData.direccion?.colonia || '',
                        alcaldia: serviceData.direccion?.municipio || '',
                        id_estado: serviceData.direccion.estado.id || '',
                        estado: serviceData.direccion.estado.nombre || '',
                        CP: serviceData.direccion?.CP || '',
                        int: serviceData.direccion?.int || '',
                        ext: serviceData.direccion?.ext || '',
                        telefono: serviceData.detalle_servicio?.telefono || '',
                        pagina_web: serviceData.detalle_servicio?.pagina_web || '',
                    };

                    setInitialValues(newInitialValues);
                    setFormValues(newInitialValues);
                    setServiceData(serviceData);

                    const mainImageData = response.data.data.servicio[0].imagenes.find(
                        (image) => image.id_tipo_imagen === 1
                    );

                    setImageData(mainImageData);

                    const galleryImageData = response.data.data.servicio[0].imagenes.filter(
                        (image) => image.id_tipo_imagen === 2
                    );
                    setImagesDataGallery(galleryImageData);
                } else {
                    console.error('No se encontraron datos de servicio');
                }
            } catch (e) {
                console.error('Error fetching service data:', e);
                console.error('Error fetching service data:', e.message, e.response);
            }
        };

        if (serviceId && serviceData === null) {
            fetchServiceData();
        }
    }, [serviceId, serviceData]);

    const getImageUrl = (imageData) => {
        if (imageData && imageData.archivo && imageData.archivo.trim().length > 0) {
            try {
                const binaryData = atob(imageData.archivo);
                const arrayBuffer = new ArrayBuffer(binaryData.length);
                const uint8Array = new Uint8Array(arrayBuffer);

                for (let i = 0; i < binaryData.length; i++) {
                    uint8Array[i] = binaryData.charCodeAt(i);
                }

                const blob = new Blob([uint8Array], { type: 'image/jpeg' });
                return URL.createObjectURL(blob);
            } catch (error) {
                throw error
            }
        }
    };

    const handleChange = (e) => {
        const { name, files } = e.target;
        if (name === 'imgPrincipal') {
            setFormValues((prevValues) => ({
                ...prevValues,
                imgPrincipal: files[0],
            }))
        } else if (name === 'arrayGaleria') {
            setFormValues((prevValues) => ({
                ...prevValues,
                arrayGaleria: Array.from(files),
            }))
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                [name]: e.target.value,
            }));
        }
    };
    const updatedFields = {
        data: {

            servicio: {
                id_tipo_servicio: formValues.id_categoria,
                id_usuario: localStorage.getItem("user_name"),
                id_pueblo: formValues.id_pueblo,
                id_estatus: 1,
            },
            servicio_detalles: {
                dias_servicio: formValues.dias_servicio,
                precios: formValues.precios,
                titulo: formValues.titulo,
                descripcion: formValues.descripcion,
                telefono: formValues.telefono,
                pagina_web: formValues.pagina_web
            },
            coordenadas: {
                longitud: formValues.longitud,
                latitud: formValues.latitud,
            },
            horarios: {
                horario_inicio: formValues.horario_inicio,
                horario_fin: formValues.horario_fin,
            },

            direccion: {
                calle: formValues.calle,
                municipio: formValues.alcaldia,
                CP: formValues.CP,
                int: formValues.int,
                ext: formValues.ext,
                colonia: formValues.colonia,
                id_estado: formValues.id_estado,
            },
        }
    };

    const updateService = async (updatedFields) => {
        try {
            const response = await fetchUpdateService(serviceId, updatedFields)
            return response;
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            throw error;
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (newimage) {
            const file = formValues.imagen_principal;

            try {
                const formData = new FormData();
                formData.append('data[imagen_principal]', file);
                formData.append('_method', 'PUT');

                const response = await fetchUpdateImages(serviceId, formData)
                if (response.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: "Se ha cargado la imagen exitosamente"
                    });

                    onDataUpdate();
                }
                return response.data;
            } catch (error) {
                console.error('Error al actualizar la imagen principal:', error);
                throw error;
            }
        } else if (newImageGallery) {

            const formDataGallery = new FormData();

            for (const file of formValues.imagenes_nuevas) {
                formDataGallery.append('data[imagenes_nuevas][]', file);
            }
            formDataGallery.append('_method', 'PUT');
            try {
                const response = await fetchUpdateImages(serviceId, formDataGallery)
                if (response.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: "Se han cargado las imagenes exitosamente"
                    });
                    onDataUpdate();
                }
                return response.data;
            } catch (error) {
                Toast.fire({
                    icon: "error",
                    title: "Error al cargar las imagenes"
                });
                throw error;
            }
        } else {
            try {
                const response = await updateService(updatedFields);
                if (response.status === 200) {
                    Toast.fire({
                        icon: "success",
                        title: "Se han actualizado la información exitosamente"
                    });
                    onDataUpdate();
                }
            } catch (error) {
                Toast.fire({
                    icon: "error",
                    title: "Error al cargar las imagenes"
                });
                throw error;
            }
        }

    };

    useEffect(() => {
    }, [serviceData]);

    if (!serviceData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="lds-ring">
                    <Spinner className="spinner-custom" size="xl" />
                </div>
            </div>)
    }

    return (
        <>
            <div className='md:flex justify-between'>
                <div className='mt-5'>
                    <Label>Pueblo Mágico</Label>
                    {!isEditable ? (
                        <TextInput
                            type='text'
                            defaultValue={formValues.pueblo}
                            readOnly={true}
                        />
                    ) : (
                        <select
                            name='id_pueblo'
                            value={formValues.id_pueblo}
                            onChange={handleChange}
                            className="w-full h-11 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option value={formValues.pueblo}>{formValues.pueblo}</option>
                            {puebloMagico.map((item) => (
                                <option key={item.id} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div className='mt-5 '>
                    <Label>Categoría</Label>
                    {!isEditable ? (
                        <TextInput
                            type='text'
                            defaultValue={formValues.categoria}
                            readOnly={true}
                        />
                    ) : (
                        <select
                            name='id_categoria'
                            value={formValues.id_categoria}
                            onChange={handleChange}
                            className="w-full h-11 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option value={formValues.categoria}>{formValues.categoria}</option>
                            {categoria.map((item) => (
                                <option key={item.id} value={item.id}>{item.servicio}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className='mt-5 block'>
                <Label>Título</Label>
                <TextInput
                    name="titulo"
                    type='text'
                    value={formValues.titulo}
                    readOnly={!isEditable}
                    onChange={handleChange}
                />

            </div>

            <div className='mt-5 block'>
                <Label>Descripción</Label>
                <Textarea
                    name="descripcion"
                    value={formValues.descripcion}
                    rows={4}
                    readOnly={!isEditable}
                    onChange={handleChange}
                />
            </div>

            <div className='md:flex flex-row md:space-x-6'>
                <div className="w-full mt-5">
                    <Label>Días de servicio</Label>
                    <TextInput
                        name='dias_servicio'
                        type="text"
                        value={formValues.dias_servicio}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de apertura</Label>
                    <TextInput
                        name='horario_inicio'
                        type="time"
                        value={formValues.horario_inicio}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de cierre</Label>
                    <TextInput
                        name='horario_fin'
                        type="time"
                        value={formValues.horario_fin}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Precio</Label>
                    <TextInput
                        name='precios'
                        type="text"
                        value={formValues.precios}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Latitud</Label>
                    <TextInput
                        name='latitud'
                        type="text"
                        value={formValues.latitud}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Longitud</Label>
                    <TextInput
                        name='longitud'
                        type="text"
                        value={formValues.longitud}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="md:flex flex-row md:space-x-6">
                <div className="w-full mt-5">
                    <Label>Calle</Label>
                    <TextInput
                        name='calle'
                        type="text"
                        value={formValues.calle}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Colonia</Label>
                    <TextInput
                        name='colonia'
                        type="text"
                        value={formValues.colonia}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className='md:flex flex-row md:space-x-6'>
                <div className="w-full mt-5">
                    <Label>Alcaldía/Municipio</Label>
                    <TextInput
                        name="alcaldia"
                        type="text"
                        value={formValues.alcaldia}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Estado</Label>
                    {!isEditable ? (
                        <TextInput
                            type='text'
                            value={formValues.estado}
                            readOnly={true}
                            onChange={handleChange}
                        />
                    ) : (
                        <select
                            name='id_estado'
                            value={formValues.id_estado} onChange={handleChange}
                            className="block w-full h-11 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option value={formValues.estado}>{formValues.estado}</option>
                            {estado.map((item) => (
                                <option key={item.id} value={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    )}

                </div>
            </div>

            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Código Postal</Label>
                    <TextInput
                        name='CP'
                        type="text"
                        value={formValues.CP}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Núm. Int</Label>
                    <TextInput
                        name='int'
                        type="text"
                        value={formValues.int}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Núm. Ext</Label>
                    <TextInput
                        name='ext'
                        type="text"
                        value={formValues.ext}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Teléfono</Label>
                    <TextInput
                        name='telefono'
                        type="number"
                        value={formValues.telefono}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Sitio web</Label>
                    <TextInput
                        name='pagina_web'
                        type="text"
                        value={formValues.pagina_web}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mt-5 border-t-2">
                <div className='mt-3'>
                    <Label htmlFor="imagen_principal">Imagen principal </Label>
                </div>
                {isEditable && (

                    <div
                        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                        onDragOver={handleDragOver}
                        onDrop={Array.isArray(imageData) && imageData.length > 0 ? (e) => e.preventDefault() : handleDropMainImage}
                    >
                        <div className="text-center">
                            <div className="mt-4 flex text-sm leading-6 text-gray-600" >
                                <label
                                    htmlFor="imagen_principal"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                                >
                                    <span>Sube un archivo</span>
                                    <input id="imagen_principal" name="imagen_principal" type="file" className="sr-only" onChange={handleMainImageUpload} />
                                </label>
                                <p className="pl-1">o arrastra y suelta</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                )}
                {imageData && (
                    <div className="mt-5 flex justify-center">
                        <div className='w-40 flex justify-center'>
                            <div className="bg-white shadow-md rounded-md overflow-hidden">
                                <div className='relative'>
                                    <button
                                        className='absolute  right-1 bg-white rounded-full p-1 hover:bg-gray-100'
                                        hidden={!isEditable}
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: 'Esta acción eliminará la imagen de manera permanente',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#6C1D45',
                                                cancelButtonColor: '#707372',
                                                confirmButtonText: 'Sí, eliminar',
                                                cancelButtonText: 'Cancelar'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleRemoveDataMainImage(imageData.id, imageData.nombre, imageData.id_tipo_imagen);
                                                    Swal.fire({
                                                        title: " Eliminada!",
                                                        text: "Tu imagen ha sido eliminada.",
                                                        icon: "success"
                                                    });
                                                }
                                            });
                                        }}
                                    >
                                        <HiX />
                                    </button>
                                </div>
                                <div>
                                    <img
                                        src={getImageUrl(imageData)}
                                        alt={imageData.nombre}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {mainImage && (
                    <div className="mt-5 flex justify-center">
                        <div className='w-40 flex justify-center'>
                            <div className="bg-white shadow-md rounded-md overflow-hidden">
                                <div className='relative'>
                                    <button className='absolute  right-1 bg-white rounded-full p-1 hover:bg-gray-100'
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: 'Esta acción eliminará la imagen de manera permanente',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#6C1D45',
                                                cancelButtonColor: '#707372',
                                                confirmButtonText: 'Sí, eliminar',
                                                cancelButtonText: 'Cancelar'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleRemoveMainImage();
                                                    Swal.fire({
                                                        title: " Eliminada!",
                                                        text: "Tu imagen ha sido eliminada.",
                                                        icon: "success"
                                                    });
                                                }
                                            });
                                        }}>
                                        <HiX />
                                    </button>
                                </div>
                                <div className="">
                                    <img
                                        src={URL.createObjectURL(mainImage)}
                                        alt="Main Image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div >

            <div className='mt-5 border-t-2'>
                <div className='mt-3'>
                    <Label>Imágenes de galería</Label>
                </div>
                {isEditable && (
                    <div
                        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                        onDragOver={handleDragOver}
                        onDrop={handleDropGalleryImages}
                    >
                        <div className="text-center">
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                    htmlFor="arrayGaleria"
                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                                >
                                    <span>Sube uno o varios archivos</span>
                                    <input id="arrayGaleria" name="arrayGaleria" type="file" multiple className="sr-only" onChange={handleGalleryImageUpload} />
                                </label>
                                <p className="pl-1">o arrastra y suelta</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>

                )}

                {imagesDataGallery.length > 0 && (
                    <div className="mt-12">
                        <div className='grid grid-cols-3 gap-2'>
                            {imagesDataGallery.map((image) => (
                                <div className="bg-white shadow-md rounded-md overflow-hidden">
                                    <div className='relative'>
                                        <button
                                            className="absolute right-0 bg-white rounded-full p-1 hover:bg-gray-100"
                                            hidden={!isEditable}
                                            onClick={() => {
                                                Swal.fire({
                                                    title: '¿Estás seguro?',
                                                    text: 'Esta acción eliminará la imagen de manera permanente',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#6C1D45',
                                                    cancelButtonColor: '#707372',
                                                    confirmButtonText: 'Sí, eliminar',
                                                    cancelButtonText: 'Cancelar'

                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleRemoveDataMainImage(image.id, image.nombre);
                                                        Swal.fire({
                                                            title: " Eliminada!",
                                                            text: "Tu imagen ha sido eliminada.",
                                                            icon: "success"
                                                        });
                                                    }
                                                });
                                            }}
                                        >
                                            <HiX />
                                        </button>
                                    </div>
                                    <div>
                                        <img
                                            key={image.id}
                                            src={getImageUrl(image)}
                                            alt={image.nombre}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    {galleryImages.length > 0 && (
                        <div className="mt-12">
                            <div className="grid grid-cols-3 gap-2">
                                {galleryImages.map((image, index) => (
                                    <div className="bg-white shadow-md rounded-md overflow-hidden" key={index}>
                                        <div className="relative">

                                            <button
                                                className="absolute right-0 bg-white rounded-full p-1 hover:bg-gray-100"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: '¿Estás seguro?',
                                                        text: 'Esta acción eliminará la imagen de manera permanente',
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#6C1D45',
                                                        cancelButtonColor: '#707372',
                                                        confirmButtonText: 'Sí, eliminar',
                                                        cancelButtonText: 'Cancelar'
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            handleRemoveGalleryImages();
                                                            Swal.fire({
                                                                title: " Eliminada!",
                                                                text: "Tu imagen ha sido eliminada.",
                                                                icon: "success"
                                                            });
                                                        }
                                                    });
                                                }}
                                            >
                                                <HiX />
                                            </button>
                                        </div>
                                        <div className="h-36">
                                            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} key={index} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end gap-4" >
                    <div>
                        <Tooltip content="Guardar publicación">
                            <button
                                type="submit"
                                className="md:flex-1 py-3 px-3 bg-[#6C1D45] hover:bg-[#8C3A68] text-white rounded-full"
                                hidden={!isEditable}
                                onClick={handleUpdate}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Spinner className='spinner-custom' aria-label="Spinner de carga" />
                                ) : (
                                    <MdDataSaverOn />
                                )}
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ModalSolicitud
