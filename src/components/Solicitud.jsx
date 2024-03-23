

function Solicitud() {
    return (
        <div>
            <div className='m-3 bg-white shadow-md px-5 py-10 rounded-xl'>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Título: {''}
                    <span className='font-normal normal-case'>Barcelo</span>
                </p>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Servicio: {''}
                    <span className='font-normal normal-case'>Sector Hotelero</span>
                </p>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Direccion: {''}
                    <span className='font-normal normal-case'>Av México, Hipódromo, Cuauhtémoc, 06100 Ciudad de México, CDMX</span>
                </p>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Dias de servicio: {''}
                    <span className='font-normal normal-case'>Lunes a domingo</span>
                </p>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Horarios: {''}
                    <span className='font-normal normal-case'>8:00 - 20:00</span>
                </p>
                <p className='font-bold mb-3 text-gray-700  uppercase'>
                    Descripcion: {''}
                    <span className='font-normal normal-case'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione sed error deserunt libero! Accusamus fugiat tempore labore? Molestias natus, voluptatibus necessitatibus nesciunt odio quae quos nostrum. Deserunt inventore error laudantium.</span>
                </p>
                <div className="flex justify-between mt-10">
                    <button
                    type="button"
                    className="py-2 px-10 bg-[#6C1D45] hover:bg-[#8C3A68] text-white font-bold uppercase rounded-lg">
                        Aceptar
                    </button>
                    <button
                    type="button"
                    className="py-2 px-10 bg-slate-950 hover:bg-slate-800 text-white font-bold uppercase rounded-lg">
                        Editar
                    </button>
                    <button
                    type="button"
                    className="py-2 px-10 bg-[#707372] hover:bg-[#8D9293] text-white font-bold uppercase rounded-lg">
                        Rechazar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Solicitud
