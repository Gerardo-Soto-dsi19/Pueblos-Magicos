import React from 'react'
import { Badge } from 'flowbite-react'
import { HiDotsVertical } from "react-icons/hi";

function CardSolicitud() {
    return (
        <div>
            <div className='m-3 bg-white shadow-md px-5 py-4 rounded-xl flex justify-between'>
                <div className='w-2/3'>
                    <p className='font-bold mb-3 text-gray-700  uppercase'>
                        Usuario: {''}
                        <span className='font-normal normal-case'>correo@correo.com</span>
                    </p>
                    <p className='font-bold mb-3 text-gray-700  uppercase'>
                        Tipo rol: {''}
                        <span className='font-normal normal-case'>Sector hotelero</span>
                    </p>
                    <div className="flex">
                        <p className='flex gap-3 font-bold text-gray-700  uppercase'>
                            Estado: {''}
                            <Badge color={'success'} className='h-auto'>
                                Aceptado
                            </Badge>
                        </p>
                    </div>
                </div>
                <div className='flex items-center cursor-pointer'>
                    <HiDotsVertical />
                </div>
            </div>

        </div >
    )
}

export default CardSolicitud
