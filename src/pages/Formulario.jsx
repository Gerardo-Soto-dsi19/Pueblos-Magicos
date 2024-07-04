import { useRef, useState, useEffect, useContext, memo } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Spinner, Tooltip } from 'flowbite-react'
import { FiAlertCircle } from "react-icons/fi";
import { AuthContext } from '../components/AuthContext';
import { HiX } from "react-icons/hi";
import FormInput from '../components/Formulario/FormInput';
import FileUpload from '../components/Formulario/FileUpload';
import { createService, getTypesServices, getMagicTowns, getStateCatalogue } from '../api/api'
const MemoizedSelectCategoria = React.memo((props) => (
  <select
    name='categoria'
    value={props.value}
    onChange={props.onChange}
    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
  >
    <option value="">Seleccionar...</option>
    {props.options.map((item) => (
      <option key={item.id} value={item.id}>{item.servicio}</option>
    ))}
  </select>
));

const MemoizedSelectPuebloMagico = React.memo((props) => (
  <select
    name='id_pueblo'
    value={props.value}
    onChange={props.onChange}
    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
  >
    <option value="">Seleccionar...</option>
    {props.options.map((item) => (
      <option key={item.id} value={item.id}>{item.nombre}</option>
    ))}
  </select>
));

const MemoizedSelectEstado = React.memo((props) => (
  <select
    name='estado'
    value={props.value}
    onChange={props.onChange}
    className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
  >
    <option value="">Seleccionar...</option>
    {props.options.map((item) => (
      <option key={item.id} value={item.id}>{item.nombre}</option>
    ))}
  </select>
));

function Formulario() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    console.log('Error: el usuario no ha sido autenticado');
    return <Navigate to="/" replace />
  }

  const [formData, setFormData] = useState({
    id_pueblo: '',
    categoria: '',
    titulo: '',
    descripcion: '',
    dias_servicio: '',
    horario_inicio: '',
    horario_fin: '',
    precio: '',
    latitud: '',
    longitud: '',
    calle: '',
    colonia: '',
    estado: 'Puebla',
    alcaldia: '',
    CP: '',
    numInt: null,
    numExt: '',
    telefono: '',
    pagina_web: '',
    imgPrincipal: null,
    arrayGaleria: [],
  });
  const [puebloMagico, setPuebloMagico] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [estado, setEstado] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropZoneMainRef = useRef(null);
  const [dragActiveMain, setDragActiveMain] = useState(false);

  const dropZoneGalleryRef = useRef(null);
  const [dragActiveGallery, setDragActiveGallery] = useState(false);

  const handleClick = (e, indexToRemove) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del clic
    e.stopPropagation(); // Detener la propagación del evento
    handleRemoveGalleryImage(indexToRemove);
  };

  const handleRemoveMainImage = () => {
    setMainImage(null);
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setGalleryImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const resetForm = () => {
    setFormData({
      id_pueblo: '',
      categoria: '',
      titulo: '',
      descripcion: '',
      dias_servicio: '',
      horario_inicio: '',
      horario_fin: '',
      precio: '',
      latitud: '',
      longitud: '',
      calle: '',
      colonia: '',
      estado: 'Puebla',
      alcaldia: '',
      CP: '',
      numInt: '',
      numExt: '',
      telefono: '',
      pagina_web: '',
      imgPrincipal: null,
      arrayGaleria: [],
    });

    setMainImage(null);
    setGalleryImages([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasResponse, pueblosMagicosResponse, estadosResponse] = await Promise.all([
          getTypesServices(),
          getMagicTowns(),
          getStateCatalogue(),
        ]);

        setCategoria(categoriasResponse.data.data);
        setPuebloMagico(pueblosMagicosResponse.data.data);
        setEstado(estadosResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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


  const handleChange = (e) => {
    const { name, files } = e.target;

    if (name === 'imgPrincipal') {
      setFormData((prevState) => ({
        ...prevState,
        imgPrincipal: files[0],
      }));
      setMainImage(files[0])
    } else if (name === 'arrayGaleria') {
      const fileImg = e.target.files
      setFormData((prevState) => ({
        ...prevState,
        arrayGaleria: Array.from(files),
      }));
      setGalleryImages([...galleryImages, ...Array.from(files)]);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const datosToSend = {
        data: {
          id_tipo_servicio: formData.categoria,
          municipio: formData.alcaldia,
          CP: formData.CP,
          int: formData.numInt,
          ext: formData.numExt,
          colonia: formData.colonia,
          calle: formData.calle,
          dias_servicio: formData.dias_servicio,
          horario_inicio: formData.horario_inicio,
          horario_fin: formData.horario_fin,
          precio: formData.precio,
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          latitud: formData.latitud,
          longitud: formData.longitud,
          telefono: formData.telefono,
          pagina_web: 'https://'.concat(formData.pagina_web),
          imgPrincipal: formData.imgPrincipal,
          arrayGaleria: formData.arrayGaleria,
          id_estado: '21',
          id_usuario: localStorage.getItem('user_name'),
          id_pueblo: formData.id_pueblo,
        }
      }
      const response = await createService(datosToSend)
      if (response.status === 200 || response.status === 201) {
        Toast.fire({
          icon: "success",
          title: "Se ha registrado la solicitud con exito!"
        });
        resetForm();
      }
      else if (response.status === 422) {
        console.log('Unprocessable Content');
      } else if (response.status === 401) {
        console.log('Usuario no autenticado');
      }
      else {
        console.log('Error al enviar los datos:');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Imprimir la respuesta de la API
        console.log('Error al enviar los datos:', error.response.data);
        const camposNoLlenados = Object.entries(error.response.data.data).flatMap(([campo, errores]) =>
          errores.map((error) => `-${error}`)
        );

        const mensajeError = `Los siguientes campos no se llenaron correctamente:\n\n\n${camposNoLlenados.join('\n\n')}`;

        Swal.fire({
          title: 'Error',
          text: mensajeError,
          icon: 'error',
        })
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleDrag = (e, isMain) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (isMain) {
        setDragActiveMain(true);
      } else {
        setDragActiveGallery(true);
      }
    } else if (e.type === 'dragleave') {
      if (isMain) {
        setDragActiveMain(false);
      } else {
        setDragActiveGallery(false);
      }
    }
  }

  const handleDrop = (e, isMain) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMain) {
      setDragActiveMain(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.items[0].getAsFile();
        if (file) {
          setMainImage(file);
          setFormData((prevState) => ({
            ...prevState,
            imgPrincipal: file,
          }));
        }
      }
    } else {
      setDragActiveGallery(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.items)
          .filter((item) => item.kind === 'file')
          .map((item) => item.getAsFile());

        if (files.length > 0) {
          setGalleryImages((prevImages) => [...prevImages, ...files]);
          setFormData((prevState) => ({
            ...prevState,
            arrayGaleria: [...prevState.arrayGaleria, ...files],
          }));
        }
      }
    }
  }

  const handleCancell = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se descartarán los cambios realizados",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#6C1D45',
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Toast.fire({
          icon: "info",
          title: "Se ha cancelado la solicitud con éxito"
        });

        resetForm();
      }
    });
  }

  return (
    <>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center">
              <h3 className="mb-4">Enviando solicitud</h3>
              <div className="lds-ring">
                <Spinner className="spinner-custom" size="xl" />
              </div>
            </div>
          </div>
        ) : (
          <div className='flex justify-center sm:mx-5'>
            <form onSubmit={handleSubmit} className="md:w-1/2 bg-white shadow-lg rounded-lg mt-5 mb-10 px-10">
              <h1 className='mt-5'>Formulario</h1>
              <h5 className='flex items-center font-light mt-5 text-red-700 gap-2'><FiAlertCircle />Todos los campos deben ser llenados para poder enviar la solicitud</h5>
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Pueblo Mágico
                  </label>
                  <div className="mt-2">
                    <MemoizedSelectPuebloMagico
                      value={formData.id_pueblo}
                      onChange={handleChange}
                      options={puebloMagico}
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Categoría
                  </label>
                  <div className="mt-2">
                    <MemoizedSelectCategoria
                      value={formData.categoria}
                      onChange={handleChange}
                      options={categoria}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="horario_inicio" className="block text-sm font-medium leading-6 text-gray-900">
                    Título
                  </label>
                  <div className="mt-2">
                    <input
                      type='text'
                      name="titulo"
                      id="titulo"
                      value={formData.titulo} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>

                  <div className="mt-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium leading-6 text-gray-900">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      rows={3}
                      value={formData.descripcion} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="dias_servicio" className="block text-sm font-medium leading-6 text-gray-900">
                    Días de servicio
                  </label>
                  <div className="mt-2">
                    <Tooltip content="Este campo debe contener entre 5 y 20 caracteres">
                      <input
                        type="text"
                        name="dias_servicio"
                        value={formData.dias_servicio} onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                      />
                    </Tooltip>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="horario_inicio" className="block text-sm font-medium leading-6 text-gray-900">
                    Horario de apertura
                  </label>
                  <div className="mt-2">
                    <input
                      type="time"
                      name="horario_inicio"
                      id="horario_inicio"
                      value={formData.horario_inicio} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="horario_fin" className="block text-sm font-medium leading-6 text-gray-900">
                    Horario de cierre
                  </label>
                  <div className="mt-2">
                    <input
                      type="time"
                      name="horario_fin"
                      id="horario_fin"
                      value={formData.horario_fin} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="precio" className="block text-sm font-medium leading-6 text-gray-900">
                    Precio
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="precio"
                      id="precio"
                      value={formData.precio} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="latitud" className="block text-sm font-medium leading-6 text-gray-900">
                    Latitud
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="latitud"
                      id="latitud"
                      value={formData.latitud} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="longitud" className="block text-sm font-medium leading-6 text-gray-900">
                    Longitud
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="longitud"
                      id="longitud"

                      value={formData.longitud} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                {/* Meter inputs para direccion (incluir colonia) */}

                <div className="sm:col-span-3">
                  <label htmlFor="calle" className="block text-sm font-medium leading-6 text-gray-900">
                    Calle
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="calle"
                      id="calle"
                      value={formData.calle} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="colonia" className="block text-sm font-medium leading-6 text-gray-900">
                    Colonia
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="colonia"
                      id="colonia"
                      value={formData.colonia} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="alcaldia" className="block text-sm font-medium leading-6 text-gray-900">
                    Alcaldía/Municipio
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="alcaldia"
                      id="alcaldia"
                      value={formData.alcaldia} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Estado
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name='estado'
                      defaultValue={'Puebla'}
                      readOnly={true}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="CP" className="block text-sm font-medium leading-6 text-gray-900">
                    Código postal
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="CP"
                      id="CP"
                      value={formData.CP} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="numExt" className="block text-sm font-medium leading-6 text-gray-900">
                    Núm Ext.
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="numExt"
                      id="numExt"
                      value={formData.numExt} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="numInt" className="block text-sm font-medium leading-6 text-gray-900">
                    Núm Int.
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="numInt"
                      id="numInt"
                      value={formData.numInt || null} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="telefono" className="block text-sm font-medium leading-6 text-gray-900">
                    Teléfono
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="telefono"
                      id="telefono"
                      value={formData.telefono} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="pagina_web" className="block text-sm font-medium leading-6 text-gray-900">
                    Sitio Web
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="pagina_web"
                      id="pagina_web"
                      value={formData.pagina_web} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Imagen Principal
                  </label>
                  <div
                    className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 ${dragActiveMain ? 'bg-gray-200' : 'border-gray-900/25'
                      }`}
                    ref={dropZoneMainRef}
                    onDragEnter={(e) => handleDrag(e, true)}
                    onDragOver={(e) => handleDrag(e, true)}
                    onDragLeave={(e) => handleDrag(e, true)}
                    onDrop={(e) => handleDrop(e, true)}
                  >
                    <div className="text-center">
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="imgPrincipal"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                        >
                          <span>Sube un archivo</span>
                          <input id="imgPrincipal" name="imgPrincipal" type="file" className="sr-only" onChange={handleChange} />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hasta 1 MB</p>
                    </div>
                  </div>
                  {mainImage && (
                    <div className="mt-5 flex justify-center">
                      <div className='w-60 flex justify-center'>
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
                </div>

                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Imagenes de galería
                  </label>
                  <div
                    className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 ${dragActiveGallery ? 'bg-gray-200' : 'border-gray-900/25'
                      }`}
                    ref={dropZoneGalleryRef}
                    onDragEnter={(e) => handleDrag(e, false)}
                    onDragOver={(e) => handleDrag(e, false)}
                    onDragLeave={(e) => handleDrag(e, false)}
                    onDrop={(e) => handleDrop(e, false)}
                  >
                    <div className="text-center">
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="arrayGaleria"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                        >
                          <span>Sube uno o varios archivos</span>
                          <input
                            id="arrayGaleria"
                            name="arrayGaleria"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hasta 1 MB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex'>
                {galleryImages.length > 0 && (
                  <div className="mt-12">
                    <div className="grid grid-cols-3 gap-2">
                      {galleryImages.map((image, index) => (
                        <div className="bg-white shadow-md rounded-md overflow-hidden" key={index}>
                          <div className="relative">
                            <button
                              className="absolute right-0 bg-white rounded-full p-1 hover:bg-gray-100"
                              onClick={(e) => handleClick(e, index)}
                            >
                              <HiX />
                            </button>
                          </div>
                          <div className="md:h-36">
                            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} key={index} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              <div className="mt-6 py-5 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={handleCancell}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#6C1D45] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(90,18,54,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default Formulario
