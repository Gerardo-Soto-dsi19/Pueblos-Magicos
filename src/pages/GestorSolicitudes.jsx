import { Tabs } from 'flowbite-react';
import React from 'react'
import { } from 'react-icons'
import Solicitud from '../components/Solicitud';
function GestorSolicitudes() {
    return (
        <>
            <div className='flex justify-center'>
                <div className='flex-col justify-center'>
                    <h1>Solicitudes</h1>
                    <div className="md:flex gap-10 px-10 py-10 shadow-md rounded-md">
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

                    </div>
                </div>

            </div>

            <div className='max-w-4xl mx-auto'>
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="md:h-screen overflow-y-scroll mt-10">
                        <Solicitud />
                        <Solicitud />
                        <Solicitud />
                    </div>
                </div>
            </div>

        </>
    )
}

export default GestorSolicitudes
