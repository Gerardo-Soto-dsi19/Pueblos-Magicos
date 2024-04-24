import { useEffect, useState } from 'react';
import { TextInput, Textarea, Label, Dropdown, Tooltip, Spinner } from "flowbite-react"
import { MdDataSaverOn } from "react-icons/md";
import { HiX } from "react-icons/hi";
import axios from 'axios';
import Swal from 'sweetalert2';
import React from 'react';
import FormData from 'form-data';



function ModalSolicitud({ serviceId, isEditable }) {
    const [puebloMagico, setPuebloMagico] = useState([])
    const [categoria, setCategoria] = useState([])
    const [estado, setEstado] = useState([])
    const [serviceData, setServiceData] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [imageData, setImageData] = useState(null);
    const [imagesDataGallery, setImagesDataGallery] = useState([]);
    const [initialValues, setInitialValues] = useState({});
    const [formValues, setFormValues] = useState(initialValues);
    const [newimage, setNewImage] = useState(false);


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
    };

    const handleGalleryImageUpload = (event) => {
        const files = event.target.files;
        setGalleryImages([...galleryImages, ...Array.from(files)]);

    };

    const handleRemoveMainImage = () => {
        setMainImage(null);
    };

    const handleRemoveDataMainImage = (id, name, tipo_img) => {

        const token = sessionStorage.getItem('accessToken');
        const imageDataToDelete = {
            data: {
                imagenes_eliminar: [
                    {
                        id: id,
                        nombre: name
                    }
                ]
            }
        };
        try {
            axios.put(`http://localhost/api/servicios/${serviceId}`, imageDataToDelete, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    '_method': 'put',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (tipo_img === 1) {
                    setImageData(prevImage => prevImage.filter(image => image.id !== id));
                } else {
                    setImagesDataGallery(prevImages => prevImages.filter(image => image.id !== id));
                }

            })

        } catch (error) {
            console.error('Error:', error);
        }


    }

    /* Seteo de combos  */
    useEffect(() => {
        axios.get('http://localhost/api/tiposervicios')
            .then(response => {
                setCategoria(response.data.data)
            })
            .catch(error => {
                console.error('Error fetching states:', error);
            });
    }, []);


    useEffect(() => {
        axios.get('http://localhost/api/pueblosmagicos')
            .then(response => { setPuebloMagico(response.data.data) })
            .catch(error => {
                console.error('Error fetching pueblos:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost/api/catestados')
            .then(response => { setEstado(response.data.data) })
            .catch(error => {
                console.error('Error fetching estados:', error);
            });
    }, []);



    /* Seteo de informacion en inputs */
    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost/api/servicios/${serviceId}`, config);
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
                // O también puedes acceder a las propiedades del objeto de error
                console.error('Error fetching service data:', e.message, e.response);
            }
        };

        if (serviceId && serviceData === null) {
            fetchServiceData();
        }
    }, [serviceId, serviceData]);

    const getImageUrl = (imageData) => {

        const binaryData = atob(imageData.archivo);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
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
            const token = sessionStorage.getItem('accessToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    '_method': 'put',
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.put(`http://localhost/api/servicios/${serviceId}`, updatedFields, config);
            console.log('Servicio actualizado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el servicio:', error);
            throw error;
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (newimage) {
            const file = formValues.imagen_principal;

            try {
                const formData = new FormData();
                formData.append('data[imagen_principal]', file);

                const token = sessionStorage.getItem('accessToken');

                const response = await axios.post(`http://localhost/api/servicios/${serviceId}`, formData, {
                    headers: {
                        '_method': 'PUT',
                        Authorization: `Bearer ${token}`,
                        'accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    }
                });
                console.log('Servicio actualizado exitosamente:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error al actualizar el servicio:', error);
                throw error;
            }
        }
    };






    /*         try {
                const response = await updateService(updatedFields);
                console.log('Servicio actualizado exitosamente:', response.data);
            } catch (error) {
                console.error('Error al actualizar el servicio:', error);
            } */
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
                <div className='mt-5 md:w-[50%]'>
                    <Label>Pueblo Mágico</Label>
                    <Dropdown name='id_pueblo' label={formValues.pueblo} dismissOnClick={false} color={'gray'}>
                        {puebloMagico.map((option) => (
                            <Dropdown.Item key={option.id} value={option.id} >{option.nombre}</Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
                <div className='mt-5 md:w-[50%]'>
                    <Label>Categoría</Label>
                    <Dropdown name='categoria' label={formValues.categoria} dismissOnClick={false} color={'gray'}>
                        {categoria.map((option) => (
                            <Dropdown.Item key={option.id} value={option.id}>{option.servicio}</Dropdown.Item>
                        ))}
                    </Dropdown>
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
                        value={formValues.dias_servicio || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de apertura</Label>
                    <TextInput
                        name='horario_inicio'
                        type="time"
                        value={formValues.horario_inicio || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de cierre</Label>
                    <TextInput
                        name='horario_fin'
                        type="time"
                        value={formValues.horario_fin || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Precio</Label>
                    <TextInput
                        name='precio'
                        type="text"
                        value={formValues.precios || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Latitud</Label>
                    <TextInput
                        name='latitud'
                        type="text"
                        value={formValues.latitud || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Longitud</Label>
                    <TextInput
                        name='longitud'
                        type="text"
                        value={formValues.longitud || 'N/A'}
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
                        value={formValues.calle || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Colonia</Label>
                    <TextInput
                        name='colonia'
                        type="text"
                        value={formValues.colonia || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className='md:flex flex-row md:space-x-6'>
                <div className="w-full mt-5">
                    <Label>Alcaldía/Municipio</Label>
                    <TextInput
                        name="municipio"
                        type="text"
                        value={formValues.alcaldia || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-full mt-5">
                    <Label>Estado</Label>
                    <Dropdown label={formValues.estado} dismissOnClick={false} color={'gray'}>
                        {estado.map((option) => (
                            <Dropdown.Item key={option.id} value={option}>
                                {option.nombre}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            </div>

            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Código Postal</Label>
                    <TextInput
                        name='CP'
                        type="text"
                        value={formValues.CP || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Núm. Int</Label>
                    <TextInput
                        name='numInt'
                        type="text"
                        value={formValues.int || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-5">
                    <Label>Núm. Ext</Label>
                    <TextInput
                        name='numExt'
                        type="text"
                        value={formValues.ext || 'N/A'}
                        readOnly={!isEditable}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mt-5 border-t-2">
                <div className='mt-3'>
                    <Label htmlFor="imagen_principal">Imagen principal </Label>
                </div>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
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
                                        hidden={!isEditable}
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: 'Esta acción eliminará la imagen de manera permanente',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, eliminar',
                                                cancelButtonText: 'Cancelar'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleRemoveDataMainImage(imageData.id, imageData.nombre, imageData.id_tipo_imagen);
                                                    Swal.fire({
                                                        title: "Deleted!",
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
                                    <button className='absolute  right-1 bg-white rounded-full p-1 hover:bg-gray-100' onClick={handleRemoveMainImage}>
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
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#d33',
                                                    confirmButtonText: 'Sí, eliminar',
                                                    cancelButtonText: 'Cancelar'

                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleRemoveDataMainImage(image.id, image.nombre);
                                                        Swal.fire({
                                                            title: "Deleted!",
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
                <div className="mt-6 flex justify-end" >
                    <div>
                        <Tooltip content="Guardar publicación">
                            <button
                                type="submit"
                                className="md:flex-1 py-3 px-3 bg-[#6C1D45] hover:bg-[#8C3A68] text-white rounded-full"
                                hidden={!isEditable}
                                onClick={handleUpdate}
                            >
                                <MdDataSaverOn />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ModalSolicitud
