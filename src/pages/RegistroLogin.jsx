import { Outlet } from 'react-router-dom'

function RegistroLogin() {
  return (
    <div className='md:flex justify-center items-center'>
      <div className="border-slate-700 shadow-lg rounded-lg mt-10 mb-10 px-20">
        <h1>Registrar usuario</h1>
        <form>
          <div className="space-y-12 mb-10">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Información Personal</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Utilice una dirección email permanente en la que pueda recibir correos.</p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Nombre(s)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Primer apellido
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Segundo apellido
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Correo
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Contraseña
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Confirmar contraseña
                  </label>
                  <div className="mt-2">
                    <input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="passwordConfirm"                      
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">Tipo pueblo Mágico</legend>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Por favor indique que a que sector esta enfocado</p>
                  <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                      <input
                        id="push-pueblo"
                        name="push-notifications"
                        type="radio"
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                      />
                      <label htmlFor="push-pueblo" className="block text-sm font-medium leading-6 text-gray-900">
                        Director Pueblo Magico
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-hotelero"
                        name="push-notifications"
                        type="radio"
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                      />
                      <label htmlFor="push-hotelero" className="block text-sm font-medium leading-6 text-gray-900">
                        Hotelero
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="push-restaurantero"
                        name="push-notifications"
                        type="radio"
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                      />
                      <label htmlFor="push-restaurantero" className="block text-sm font-medium leading-6 text-gray-900">
                        Restaurantero
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="mt-6 py-5 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
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
      <Outlet />
    </div>
  )
}

export default RegistroLogin
