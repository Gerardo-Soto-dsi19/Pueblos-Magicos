import { useState, useEffect } from 'react';
import axios from "axios"
import FormData from 'form-data';
import Swal from 'sweetalert2';

function Formulario() {

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
    estado: '',
    alcaldia: '',
    CP: '',
    numInt: '',
    numExt: '',
    imgPrincipal: null,
    arrayGaleria: [],
  });

  const [puebloMagico, setPuebloMagico] = useState([])
  const [categoria, setCategoria] = useState([])
  const [estado, setEstado] = useState([])


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
    } else if (name === 'arrayGaleria') {
      setFormData((prevState) => ({
        ...prevState,
        arrayGaleria: Array.from(files),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      if (formData.imgPrincipal) {
        formDataToSend.append('imgPrincipal', formData.imgPrincipal);
      }

      // Agrega las imágenes adicionales
      if (formData.arrayGaleria.length > 0) {
        formData.arrayGaleria.forEach((imagen) => {
          formDataToSend.append('arrayGaleria', imagen);
        });
      }

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
          imgPrincipal: formData.imgPrincipal,
          arrayGaleria: formData.arrayGaleria,
          id_estado: formData.estado,
          id_usuario: '1',
          id_pueblo: formData.id_pueblo,
        }
      }

      const response = await axios.post('http://localhost/api/servicios/registrar', datosToSend, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },

      });
      if (response.status === 200 || response.status === 201) {
        console.log('Datos enviados exitosamente');
        Toast.fire({
          icon: "success",
          title: "Se ha registrado la solicitud con exito!"
        });
      }
      else if (response.status === 422) {
        console.log('Unprocessable Contentaaaa');
      } else {
        console.log('Error al enviar los datos:');

      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Imprimir la respuesta de la API
        console.log('Error al enviar los datossss:', error.response.data);
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
      /*       console.error('Error al enviar los datos:', error);
            console.log('Campos sin llenar',response.data.data);
            Toast.fire({
              icon:'error',
              title: 'Ha ocurrido un error al enviar la solicitud'
            }); */
    }
  }

  return (
    <>
      <div className="md:flex justify-center items-center ">
        <form onSubmit={handleSubmit} className="shadow-lg rounded-lg mt-5 mb-10 px-14">
          <div className="space-y-12 mb-10">
            <h1>Formulario</h1>
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Pueblo Magico
                  </label>
                  <div className="mt-2">
                    <select
                      name='id_pueblo'
                      value={formData.id_pueblo}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Seleccionar...</option>
                      {puebloMagico.map((item) => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Categoria
                  </label>
                  <div className="mt-2">
                    <select
                      name='categoria'
                      value={formData.categoria}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Seleccionar...</option>
                      {categoria.map((item) => (
                        <option key={item.id} value={item.id}>{item.servicio}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="titulo" className="block text-sm font-medium leading-6 text-gray-900">
                    Titulo
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="titulo"
                      id="titulo"
                      value={formData.titulo} onChange={handleChange}
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="descripcion" className="block text-sm font-medium leading-6 text-gray-900">
                      Descripcion
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      rows={3}
                      value={formData.descripcion} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="dias_servicio" className="block text-sm font-medium leading-6 text-gray-900">
                    Días de servicio
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="dias_servicio"
                      value={formData.dias_servicio} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="alcaldia" className="block text-sm font-medium leading-6 text-gray-900">
                    Alcaldia/Municipio
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="alcaldia"
                      id="alcaldia"
                      value={formData.alcaldia} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Estado
                  </label>
                  <div className="mt-2">
                    <select
                      name='estado'
                      value={formData.estado} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Seleccionar...</option>
                      {estado.map((item) => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="CP" className="block text-sm font-medium leading-6 text-gray-900">
                    Codigo Postal
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="CP"
                      id="CP"
                      value={formData.CP} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                      value={formData.numInt} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="numExt" className="block text-sm font-medium leading-6 text-gray-900">
                    Núm Ext.
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="numExt"
                      id="numExt"
                      value={formData.numExt} onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Imagen Principal
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Imagenes de galeria
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="arrayGaleria"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                        >
                          <span>Sube uno o varios archivos</span>
                          <input id="arrayGaleria" name="arrayGaleria" type="file" multiple className="sr-only" onChange={handleChange} />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="mt-6 py-5 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#5A1236] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[rgb(90,18,54,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>



    </>
  )
}

export default Formulario
