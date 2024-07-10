import React from 'react'


function Filtros({ filtros, onFiltroChange }) {
    const handleInputChange = (e) => {
        onFiltroChange({ buscar: e.target.value });
    };

    const handleRadioChange = (e) => {
        onFiltroChange({ [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        onFiltroChange({ conTuristas: e.target.checked ? '1' : '0' });
    };

    const handleSearch = () => {
        // Si necesitas alguna acción específica al presionar el botón de búsqueda
        // Puedes implementarla aquí
    };

    return (
        <>
            <h2 className='mt-5 mx-2'>Filtros</h2>
            <div className='w-full mb-4'>
                <div className='flex flex-col sm:flex-row mt-5'>
                    <input
                        type="text"
                        className='w-full sm:w-2/3 rounded-t-md sm:rounded-l-md sm:rounded-t-none border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]'
                        placeholder='Buscar un usuario'
                        value={filtros.buscar}
                        onChange={handleInputChange}
                    />
                    <button
                        type='button'
                        className='w-full sm:w-1/3 mt-2 sm:mt-0 rounded-b-md sm:rounded-r-md sm:rounded-b-none bg-[#6C1D45] hover:bg-[#8C3A68] px-4 py-2 text-white'
                        onClick={handleSearch}
                    >
                        Buscar
                    </button>
                </div>
            </div>
            <div className="mt-2 mx-3 space-y-3">
                <h3>Tipo de usuario</h3>
                <div className="flex items-center gap-x-3">
                    <input
                        id="director"
                        name="tipoUser"
                        type="radio"
                        value={2}
                        checked={filtros.tipoUser === '2'}
                        onChange={handleRadioChange}
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                    />
                    <label htmlFor="director">
                        Director de pueblo mágico
                    </label>
                </div>
                <div className="flex items-center gap-x-3">
                    <input
                        id="pueblo"
                        name="tipoUser"
                        type="radio"
                        value={3}
                        checked={filtros.tipoUser === '3'}
                        onChange={handleRadioChange}
                        className="form-radio h-4 w-4 text-[#6C1D45] ring-inset focus:ring-2"
                    />
                    <label htmlFor="pueblo">
                        Pueblo mágico
                    </label>
                </div>
            </div>
            <div className="mt-6 mx-3 space-y-3">
                <h3>¿Incluir turistas?</h3>
                <div className="flex items-center gap-x-3">
                    <input
                        id="conTuristas"
                        name="conTuristas"
                        type="checkbox"
                        checked={filtros.conTuristas === '1'}
                        onChange={handleCheckboxChange}
                        className="text-[#6C1D45] ring-inset focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                    />
                    <label htmlFor="conTuristas">
                        Si
                    </label>
                </div>
            </div>
            <div className="mt-4 mx-3 space-y-3 mb-5">
                <h3>Estado del usuario</h3>
                <div className="flex items-center gap-x-3">
                    <input
                        id="activo"
                        name="estatusUser"
                        type="radio"
                        value="7"
                        checked={filtros.estatusUser === '7'}
                        onChange={handleRadioChange}
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                    />
                    <label htmlFor="activo">
                        Activo
                    </label>
                </div>
                <div className="flex items-center gap-x-3">
                    <input
                        id="inactivo"
                        name="estatusUser"
                        type="radio"
                        value="4"
                        checked={filtros.estatusUser === '4'}
                        onChange={handleRadioChange}
                        className="form-radio h-4 w-4 text-[#6C1D45]"
                    />
                    <label htmlFor="inactivo">
                        Inactivo
                    </label>
                </div>
            </div>
        </>
    )
}

export default Filtros
