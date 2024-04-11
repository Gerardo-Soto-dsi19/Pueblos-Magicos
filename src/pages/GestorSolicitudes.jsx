
import React from 'react'
import { } from 'react-icons'
import Solicitud from '../components/Solicitud';
import { Tabs } from 'flowbite-react';


import ListadoSolicitudes from '../components/ListadoSolicitudes';
function GestorSolicitudes() {

    return (
        <>
            <h1 className='mt-10 md:mx-20 mx-3 border-b-2'>Gestión de solicitudes</h1>
            <div className='md:flex flex-col mt-10 md:max-w-5xl mx-auto '>
                <div className="bg-white md:flex gap-10 md:px-5 py-5 md:py-5 shadow-md rounded-md">
                    <div className="flex items-center gap-x-3">
                        <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-[#5A1236]"
                        />
                        <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                            Pueblo Magico
                        </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <input
                            id="push-email"
                            name="push-notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-[#5A1236]"
                        />
                        <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                            Sector Hotelero
                        </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-[#5A1236]"
                        />
                        <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                            Sector Restaurantero
                        </label>
                    </div>
                    <div className="mt-2">
                        <select
                            name='id_solicitud'
                            value={''}
                            onChange={''}
                            className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="">Todas las solicitudes</option>
                            <option value="">Solicitudes pendientes</option>
                            <option value="">Solicitudes completadas</option>
                        </select>
                    </div>
                </div>


            </div >
            <div className="my-2 md:max-w-5xl mx-auto md:h-screen overflow-y-scroll">
                <ListadoSolicitudes />
            </div>
        </>
    )
}

export default GestorSolicitudes
