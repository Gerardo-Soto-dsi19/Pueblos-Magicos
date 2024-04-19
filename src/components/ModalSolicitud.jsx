import { useEffect, useState } from 'react';
import { TextInput, Textarea, Label, Dropdown } from "flowbite-react"
import { HiX } from "react-icons/hi";
import axios from 'axios';
import Swal from 'sweetalert2';
import React from 'react';



function ModalSolicitud({ serviceId }) {
    const [puebloMagico, setPuebloMagico] = useState([])
    const [categoria, setCategoria] = useState([])
    const [estado, setEstado] = useState([])
    const [serviceData, setServiceData] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [imageData, setImageData] = useState(null);
    const [imagesDataGallery, setImagesDataGallery] = useState([]);


    const handleMainImageUpload = (event) => {
        if (imageData != null) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puedes cargar dos imagenes de perfil"
            });
        } else {
            const file = event.target.files[0];
            setMainImage(file);
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
        console.log(id, name, tipo_img);
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
                console.log('Componente afectado:', response.data);
                if(tipo_img ===1 ){
                    setImageData(prevImage => prevImage.filter(image => image.id !== id ));
                }else{
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
                setServiceData(response.data.data.servicio[0]);

                const mainImageData = response.data.data.servicio[0].imagenes.find(
                    (image) => image.id_tipo_imagen === 1
                );

                setImageData(mainImageData);

                const galleryImageData = response.data.data.servicio[0].imagenes.filter(
                    (image) => image.id_tipo_imagen === 2
                );
                setImagesDataGallery(galleryImageData);

            } catch (e) {
                console.error('Error fetching service data: ', e);
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


    useEffect(() => {
    }, [serviceData]);

    if (!serviceData) {
        return <div>Cargando...</div>;
    }


    const handleImageUpload = (event) => {
        const files = event.target.files;
        setImages([...images, ...Array.from(files)]);
    };

    return (
        <>

            <div className='md:flex justify-between'>
                <div className='mt-5 md:w-[50%]'>
                    <Label>Pueblo Mágico</Label>
                    <Dropdown label={serviceData.pueblo.nombre} dismissOnClick={false} color={'gray'}>
                        {puebloMagico.map((option) => (
                            <Dropdown.Item key={option.id} >{option.nombre}</Dropdown.Item>
                        ))}
                    </Dropdown>

                </div>
                <div className='mt-5 md:w-[50%]'>
                    <Label>Categoría</Label>
                    <Dropdown label={serviceData.tipo_servicio.servicio} dismissOnClick={false} color={'gray'}>
                        {categoria.map((option) => (
                            <Dropdown.Item key={option.id} value={option.id}>{option.servicio}</Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            </div>

            <div className='mt-5 block'>
                <Label>Título</Label>
                <TextInput
                    defaultValue={serviceData.detalle_servicio?.titulo ?? 'N/A'}></TextInput>
            </div>

            <div className='mt-5 block'>
                <Label>Descripción</Label>
                <Textarea
                    defaultValue={serviceData.detalle_servicio?.descripcion ?? 'N/A'}
                    rows={4} />
            </div>

            <div className='md:flex flex-row md:space-x-6'>
                <div className="w-full mt-5">
                    <Label>Días de servicio</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.dias_servicio ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de apertura</Label>
                    <TextInput type="time" defaultValue={serviceData.detalle_servicio?.horario.horario_inicio ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de cierre</Label>
                    <TextInput type="time" defaultValue={serviceData.detalle_servicio?.horario.horario_fin ?? 'N/A'} />
                </div>

            </div>
            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Precio</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.precios ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Latitud</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.coordenada.latitud ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Longitud</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.coordenada.longitud ?? 'N/A'} />
                </div>
            </div>
            <div className="md:flex flex-row md:space-x-6">
                <div className="w-full mt-5">
                    <Label>Calle</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.calle ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Colonia</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.colonia ?? 'N/A'} />
                </div>
            </div>
            <div className='md:flex flex-row md:space-x-6'>
                <div className="w-full mt-5">
                    <Label>Alcaldía/Municipio</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.municipio ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Estado</Label>
                    <Dropdown label={serviceData.direccion.estado.nombre} dismissOnClick={false} color={'gray'}>
                        {estado.map((option) => (
                            <Dropdown.Item key={option.id} value={option.id}>{option.nombre}</Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            </div>
            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Código Postal</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.CP ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Núm. Int</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.int ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Núm. Ext</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.ext ?? 'N/A'} />

                </div>
            </div>

            <div className="mt-5 border-t-2">
                <div className='mt-3'>
                    <Label>Imagen principal </Label>
                </div>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="imgPrincipal"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                            >
                                <span>Sube un archivo</span>
                                <input id="imgPrincipal" name="imgPrincipal" type="file" className="sr-only" onChange={handleMainImageUpload} />
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
                                    <button className='absolute  right-1 bg-white rounded-full p-1 hover:bg-gray-100'
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
                                    <div className="">
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
            </div >

        </>
    )
}

export default ModalSolicitud
