import React from 'react'
const handleChange = (e) => {
    setSearchUser(e.target.value)
};
function Filtros() {
    return (
        <div>
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
                <div></div>
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
                        Hotelero
                    </label>
                </div>
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
                        Hotelero
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Filtros
