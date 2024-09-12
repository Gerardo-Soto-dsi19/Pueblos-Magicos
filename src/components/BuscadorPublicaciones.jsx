import React, { useState, useEffect, useRef } from 'react';

function BuscadorPublicaciones() {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [lastSearched, setLastSearched] = useState('');
    const wrapperRef = useRef(null);

    const opciones = [
        { 
            categoria: 'Frutas', 
            opciones: [
                'Manzana', 
                'Banana', 
                'Naranja', 
                'Fresa', 
                'Pera'
            ] 
        },
        { 
            categoria: 'Verduras', 
            opciones: ['Zanahoria', 'Brócoli', 'Espinaca', 'Tomate', 'Pepino'] 
        },
        { 
            categoria: 'Carnes', 
            opciones: ['Pollo', 'Res', 'Cerdo', 'Cordero', 'Pavo'] 
        },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setIsOpen(true);

        const filtered = opciones.map(categoria => ({
            ...categoria,
            opciones: categoria.opciones.filter(opcion =>
                opcion.toLowerCase().includes(value.toLowerCase())
            )
        })).filter(categoria => categoria.opciones.length > 0);

        setFilteredOptions(filtered);
    };

    const handleSelectOption = (opcion) => {
        setInputValue(opcion);
        setIsOpen(false);
    };

    const handleSearch = () => {
        setLastSearched(selectedOption || inputValue);
        // Aquí normalmente harías una llamada a una API o actualizarías el estado global
        console.log(`Búsqueda realizada: ${selectedOption || inputValue}`);
        // Simular una recarga del DOM
        document.body.style.opacity = '0.5';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 300);
    };

    return (
        <>
            <div className="w-full mt-5" ref={wrapperRef}>
                <div className="relative">
                    <div className="flex">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={() => setIsOpen(true)}
                            placeholder="Buscar..."
                            className="w-full px-4 py-2 rounded-l-md border-0  text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#6C1D45]"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-[#6C1D45] text-white rounded-r-md hover:bg-[#8C3A68]"
                        >
                            Buscar
                        </button>
                    </div>
                    {isOpen && filteredOptions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredOptions.map((categoria) => (
                                <div key={categoria.categoria}>
                                    <div className="px-4 py-2 font-semibold bg-gray-100">{categoria.categoria}</div>
                                    {categoria.opciones.map((opcion) => (
                                        <div
                                            key={opcion}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                            onClick={() => handleSelectOption(opcion)}
                                        >
                                            {opcion}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
{/*                 {lastSearched && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-600">Última búsqueda: {lastSearched}</p>
                    </div>
                )} */}
            </div>

        </>
    )
}

export default BuscadorPublicaciones
