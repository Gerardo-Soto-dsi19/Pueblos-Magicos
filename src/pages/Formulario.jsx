import { useState, useEffect } from 'react';
import axios from "axios"


function Formulario() {
  const [puebloMagico, setPuebloMagico] = useState('')
  const [categoria, setCategoria] = useState([])
  const [categoriaSelected, setCategoriaSelected] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [diasServicios, setDiasServicio] = useState('')
  const [horario, setHorario] = useState('')
  const [precio, setPrecio] = useState('')
  const [telefono, setTelefono] = useState('')
  const [latitud, setLatitud] = useState('')
  const [longitud, setLongitud] = useState('')
  const [imagenes, setImagenes] = useState('')

  useEffect(() => {
    axios.get('http://localhost/api/tiposervicios')
      .then(response => {
        setCategoria(response.data.data)
      })
      .catch(error => {
        console.error('Error fetching states:', error);
      });
  }, []);

  const handleStateChange = event => {
    setCategoriaSelected(event.target.value);
  };

  return (
    <>
      <div className="md:flex justify-center items-center ">
        <form className="shadow-lg rounded-lg mt-5 mb-10 px-14">
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
                      id="#"
                      name="#"
                      autoComplete="#"
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Categoria
                  </label>
                  <div className="mt-2">
                    <select
                      value={categoriaSelected} onChange={handleStateChange}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value="">Seleccionar...</option>
                      {categoria.map(categoria => (
                        <option key={categoria.id} value={categoria.servicio}>{categoria.servicio}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                    Titulo
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="street-address"
                      id="street-address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="mt-2">
                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                      Descripcion
                    </label>
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Días de servicio
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="#"
                      id="#"
                      autoComplete="dias-servicio"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="#" className="block text-sm font-medium leading-6 text-gray-900">
                    Horario
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="#"
                      id="#"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                    Precio
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                    Teléfono
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="Latitud" className="block text-sm font-medium leading-6 text-gray-900">
                    Latitud
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="latitud"
                      id="latitud"
                      autoComplete="latitud"
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
                      autoComplete="longitud"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Imagenes
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                        >
                          <span>Sube un archivo</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
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
