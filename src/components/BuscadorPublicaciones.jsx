import React, { useState, useEffect, useRef } from 'react';
import { fetchSearchResults } from '../api/api'

function BuscadorPublicaciones({ onSearchResult, onClearSearch, isSearching }) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [lastSearched, setLastSearched] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetchSearchResults();
                setFilteredOptions(response.data.data.opciones);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

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

        if (value.trim() === '') {
            setFilteredOptions(filteredOptions);
        } else {
            const filtered = filteredOptions.map(pueblo => ({
                ...pueblo,
                titulos: pueblo.titulos.filter(titulo =>
                    titulo.toLowerCase().includes(value.toLowerCase())
                )
            })).filter(pueblo => pueblo.titulos.length > 0);
            setFilteredOptions(filtered);
        }
    }

    const handleSelectOption = (opcion) => {
        setInputValue(opcion);
        setSelectedOption(opcion);
        setIsOpen(false);
    }

    const handleSearch = () => {
        const filtros = {
            buscar: selectedOption || inputValue,
            tipoServicio: '' // Ajusta esto según tus necesidades
        };
        onSearchResult(filtros);
    }

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
                        {isSearching && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 flex justify-between items-center" role="alert">
                                <button
                                    onClick={clearSearch}
                                    className="px-4 py-2 bg-[#6C1D45] text-white rounded-md hover:bg-[#8C3A68]"
                                >
                                    Regresar
                                </button>
                            </div>
                        )}
                    </div>
                    {isOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredOptions.map((pueblo) => (
                                <div key={pueblo.pueblo}>
                                    <div className="px-4 py-2 font-semibold bg-gray-100">{pueblo.pueblo}</div>
                                    {pueblo.titulos.map((titulo) => (
                                        <div
                                            key={titulo}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                            onClick={() => handleSelectOption(titulo)}
                                        >
                                            {titulo}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default BuscadorPublicaciones
