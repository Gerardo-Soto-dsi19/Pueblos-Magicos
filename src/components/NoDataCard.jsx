import React from 'react';

const NoDataCard = () => {
    return (
        <div className="m-5 py-10 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center">
                <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-center">
                No se encontraron solicitudes
            </h2>
            <p className="mt-2 text-gray-600 text-center">
                En este momento no hay solicitudes disponibles.
            </p>
        </div>
    );
};

export default NoDataCard;