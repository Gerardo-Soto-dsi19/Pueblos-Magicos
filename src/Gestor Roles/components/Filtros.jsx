import React from 'react'

const handleChange = (e) => {
    setSearchUser(e.target.value)
};

function Filtros() {
    return (
        <div>
            <h2 className='mt-5 mx-2'>Filtros</h2>
            <div className='container mx-auto px-2 mt-5'>
                <div className='flex'>
                    <input
                        type="text"
                        className='flex-grow rounded-l-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]'
                        placeholder='Buscar un usuario'
                        onChange={handleChange}
                    />
                    <button
                        type='button'
                        className='rounded-r-md bg-[#6C1D45] hover:bg-[#8C3A68] px-4 py-1.5 text-white'
                    >
                        Buscar
                    </button>
                </div>
            </div>
            <div className="mt-6 mx-3 space-y-3">
                <h3>Tipo de usuario</h3>
                <div className="flex items-center gap-x-3">
                    <input
                        id=""
                        name=""
                        type="radio"
                        value={3}
                        onChange={''}
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                    />
                    <label >
                        Director de pueblo mágico
                    </label>
                </div>
                <div className="flex items-center gap-x-3">
                    <input
                        id=""
                        name=""
                        type="radio"
                        value={3}
                        onChange={''}
                        className="form-radio h-4 w-4 text-[#6C1D45] ring-inset focus:ring-2"
                    />
                    <label >
                        Pueblo mágico
                    </label>
                </div>
            </div>
            <div className="mt-6 mx-3 space-y-3">
                <h3>¿Incluir turistas?</h3>
                <div className="flex items-center gap-x-3">
                    <input
                        id=""
                        name=""
                        type="checkbox"
                        value={3}
                        onChange={''}
                        className=" text-[#6C1D45] ring-inset focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                    <label >
                        Si
                    </label>
                </div>
            </div>
            <div className="mt-4 mx-3 space-y-3 mb-5">
                <h3>Estado del usuario</h3>
                <div className="flex items-center gap-x-3">
                    <input
                        id=""
                        name=""
                        type="radio"
                        value={3}
                        onChange={''}
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                    />
                    <label >
                        Activo
                    </label>
                </div>
                <div className="flex items-center gap-x-3">
                    <input
                        id=""
                        name=""
                        type="radio"
                        value={3}
                        onChange={''}
                        className="form-radio h-4 w-4 text-[#6C1D45] "
                    />
                    <label >
                        Inactivo
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Filtros
