import React, { useState, useEffect } from 'react'
import { Modal, Label, Button, TextInput, Textarea } from 'flowbite-react';
import Swal from 'sweetalert2';
import { HiX } from "react-icons/hi";
import { fetchGetServicioById, fetchRemoveMainImage } from "../api/api"
function EditServiceModal({ isOpen, onClose, serviceId, onDataUpdate, onSaveAndActivate }) {
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [imageData, setImageData] = useState([]);
    const [imagesDataGallery, setImagesDataGallery] = useState([]);
    const [newimage, setNewImage] = useState(false);
    const [newImageGallery, setNewImageGallery] = useState(false);
    const [originalValues, setOriginalValues] = useState({});
    const [formValues, setFormValues] = useState({
        pueblo: '',
        categoria: '',
        titulo: '',
        descripcion: '',
        dias_servicio: '',
        precios: '',
        horario_inicio: '',
        horario_fin: '',
        calle: '',
        colonia: '',
        municipio: '',
        estado: '',
        CP: '',
        int: '',
        ext: '',
        telefono: '',
        pagina_web: '',
        latitud: '',
        longitud: ''
    });

    useEffect(() => {
        if (serviceId) {
            loadServiceData(serviceId);
        }
    }, [serviceId]);

    const loadServiceData = async (id) => {
        try {
            const response = await fetchGetServicioById(id)
            const serviceData = response.data.data.servicio[0];
            const detalleServicio = serviceData.detalle_servicio;
            const direccion = serviceData.direccion;

            const newFormValues = {
                pueblo: serviceData.pueblo.nombre,
                categoria: serviceData.tipo_servicio.servicio,
                titulo: detalleServicio.titulo || '',
                descripcion: detalleServicio.descripcion || '',
                dias_servicio: detalleServicio.dias_servicio || '',
                precios: detalleServicio.precios || '',
                horario_inicio: detalleServicio.horario.horario_inicio || '',
                horario_fin: detalleServicio.horario.horario_fin || '',
                calle: direccion.calle || '',
                colonia: direccion.colonia || '',
                municipio: direccion.municipio || '',
                estado: direccion.estado.nombre || '',
                CP: direccion.CP || '',
                int: direccion.int || '',
                ext: direccion.ext || '',
                telefono: detalleServicio.telefono || '',
                pagina_web: detalleServicio.pagina_web || '',
                latitud: detalleServicio.coordenada.latitud || '',
                longitud: detalleServicio.coordenada.longitud || ''
            };
            setFormValues(newFormValues);
            setOriginalValues(newFormValues);
            const mainImageData = response.data.data.servicio[0].imagenes.find(
                (image) => image.id_tipo_imagen === 1
            );

            setImageData(mainImageData);

            const galleryImageData = response.data.data.servicio[0].imagenes.filter(
                (image) => image.id_tipo_imagen === 2
            );
            setImagesDataGallery(galleryImageData);

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Ocurrió un error al cargar los datos del servicio',
                timer: 5000
            });
        }
    }

    const handleMainImageUpload = (event) => {
        const { files } = event.target;
        if (imageData != null) {
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
    }

    const handleGalleryImageUpload = (event) => {
        const files = event.target.files;
        setNewImageGallery(true);
        setGalleryImages([...galleryImages, ...Array.from(files)]);
        setFormValues((prevState) => ({
            ...prevState,
            imagenes_nuevas: Array.from(files),
        }));


    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

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
    }

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
    }

    const handleRemoveMainImage = () => {

        setMainImage(null);
    }

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
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
        console.log(`Campo ${name} cambiado a: ${value}`); // Para debugging
    };

    const handleSaveAndActivate = async () => {
        const changedValues = {};
        let hasChanges = false;

        Object.keys(formValues).forEach(key => {
            if (formValues[key] !== originalValues[key]) {
                changedValues[key] = formValues[key];
                hasChanges = true;
                console.log(`Campo cambiado: ${key}, Valor original: ${originalValues[key]}, Nuevo valor: ${formValues[key]}`); // Para debugging
            }
        });

        console.log('¿Hay cambios?', hasChanges); // Para debugging
        console.log('¿Nueva imagen principal?', newimage); // Para debugging
        console.log('¿Nuevas imágenes de galería?', newImageGallery); // Para debugging

        if (!hasChanges && !newimage && !newImageGallery) {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'No se ha modificado ningún campo, ¿Deseas continuar?',
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#6C1D45',
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar',
            });
            if (!result.isConfirmed) {
                return;
            }
        } else {
            console.log('Se detectaron cambios:', changedValues); // Para debugging
        }

        try {
            await onSaveAndActivate(serviceId, changedValues, newimage, newImageGallery);
            onClose();
        } catch (error) {
            console.error('Error saving service changes:', error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Ocurrió un error al guardar los cambios',
                timer: 5000
            });
        }
    };


    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>Editar información del servicio</Modal.Header>
            <Modal.Body>
                <h5 className=''>El Pueblo mágico, la categoria y el titulo no se pueden editar*</h5>
                <div className='md:flex flex-row md:space-x-6'>
                    <div className='w-full mt-5'>
                        <Label>Pueblo Mágico</Label>
                        <TextInput
                            type='text'
                            defaultValue={formValues.pueblo}
                            readOnly={true}
                        />
                    </div>
                    <div className='w-full mt-5'>
                        <Label>Categoría</Label>
                        <TextInput
                            type='text'
                            defaultValue={formValues.categoria}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className='mt-5 block'>
                    <Label>Título</Label>
                    <TextInput
                        name="titulo"
                        type='text'
                        value={formValues.titulo}
                        readOnly={true}
                        onChange={handleChange}
                    />
                </div>

                <div className='mt-5 block'>
                    <Label>Descripción</Label>
                    <Textarea
                        name="descripcion"
                        value={formValues.descripcion}
                        rows={4}
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
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full mt-5">
                        <Label>Horario de apertura</Label>
                        <TextInput
                            name='horario_inicio'
                            type="time"
                            value={formValues.horario_inicio}

                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full mt-5">
                        <Label>Horario de cierre</Label>
                        <TextInput
                            name='horario_fin'
                            type="time"
                            value={formValues.horario_fin}

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
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-5">
                        <Label>Latitud</Label>
                        <TextInput
                            name='latitud'
                            type="text"
                            value={formValues.latitud}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-5">
                        <Label>Longitud</Label>
                        <TextInput
                            name='longitud'
                            type="text"
                            value={formValues.longitud}
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
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full mt-5">
                        <Label>Colonia</Label>
                        <TextInput
                            name='colonia'
                            type="text"
                            value={formValues.colonia}
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
                            value={formValues.municipio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full mt-5">
                        <Label>Estado</Label>
                        <TextInput
                            name='estado'
                            type='text'
                            value={formValues.estado}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="md:flex flex-row md:space-x-6">
                    <div className="mt-5">
                        <Label>Código Postal</Label>
                        <TextInput
                            name='CP'
                            type="text"
                            value={formValues.CP}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mt-5">
                        <Label>Núm. Ext</Label>
                        <TextInput
                            name='ext'
                            type="text"
                            value={formValues.ext}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-5">
                        <Label>Núm. Int</Label>
                        <TextInput
                            name='int'
                            type="text"
                            value={formValues.int}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className='md:flex flex-row md:space-x-6'>
                    <div className="w-full mt-5">
                        <Label>Teléfono</Label>
                        <TextInput
                            name='telefono'
                            type="number"
                            value={formValues.telefono}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="w-full mt-5">
                        <Label>Sitio web</Label>
                        <TextInput
                            name='pagina_web'
                            type="text"
                            value={formValues.pagina_web}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mt-5 border-t-2">
                    <div className='mt-3'>
                        <Label htmlFor="imagen_principal">Imagen principal </Label>
                    </div>
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
                    {imageData && (
                        <div className="mt-5 flex justify-center">
                            <div className='w-40 flex justify-center'>
                                <div className="bg-white shadow-md rounded-md overflow-hidden">
                                    <div className='relative'>
                                        <button
                                            className='absolute  right-1 bg-white rounded-full p-1 hover:bg-gray-100'
                                            /* hidden={!isEditable} */
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
                </div>

                <div className='mt-5 border-t-2'>
                    <div className='mt-3'>
                        <Label>Imágenes de galería</Label>
                    </div>
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
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                    {imagesDataGallery.length > 0 && (
                        <div className="mt-12">
                            <div className='grid grid-cols-3 gap-2'>
                                {imagesDataGallery.map((image) => (
                                    <div className="bg-white shadow-md rounded-md overflow-hidden">
                                        <div className='relative'>
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
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose}>Cancelar</Button>
                <Button color="purple" onClick={handleSaveAndActivate}>Guardar y Activar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditServiceModal
