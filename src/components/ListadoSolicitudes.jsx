import Solicitud from "./Solicitud"


function ListadoSolicitudes() {
    return (
        <>

            <div className='md:flex flex-col my-5 px-2 '>
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

                </div>
            </div >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Solicitud />
                <Solicitud />
                <Solicitud />
                <Solicitud />
                <Solicitud />
                <Solicitud />
            </div>
        </>
    )
}

export default ListadoSolicitudes
