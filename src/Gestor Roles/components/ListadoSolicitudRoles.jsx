import React, { useEffect, useState } from 'react'
import ReactPaginate from "react-paginate";
import CardSolicitud from './CardSolicitud'
import { fetchGetFilteredUsers } from '../../api/api'

function ListadoSolicitudRoles({ filtros }) {
    const [dataUser, setDataUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchData();
    }, [currentPage, filtros]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            getFilteredData(filtros, currentPage); // Pasamos los filtros a la función de fetching
            /*             if (response.status === 200) {
                            console.log(response.data.data.usuarios.current_page);
                            setDataUser(response);
                            setTotalPages(response.data.data.usuarios.last_page)
                        } else {
                            throw new Error('No fue posible listar la información');
                        } */
        } catch (error) {
            setError('Error al cargar los usuarios: ' + error.message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getFilteredData = async (filtro, pagina) => {
        try {
            let resp
            resp = await fetchGetFilteredUsers(filtro, pagina);
            setDataUser(resp);
            setTotalPages(resp.data.data.usuarios.last_page)
            console.log(resp);
            const data = resp.data
            const totalPages = resp.data.data.usuarios.last_page;
            const currentPage = resp.data.data.usuarios.current_page;
            const adjustedPage = currentPage > totalPages ? totalPages : currentPage;

            if (adjustedPage !== currentPage) {
                resp = await fetchGetFilteredUsers(filtro, adjustedPage)
                setDataUser(resp)
            }
        } catch (error) {
            throw error
        }
    }
    const maxPageIndex = totalPages > 0 ? totalPages - 1 : 0;
    const clampedForcePage = Math.min(currentPage, maxPageIndex);

    // Refrescar los datos después de un cambio de rol
    const handleDataUpdate = () => {
        fetchData();
    };

    const handlePageClick = (event) => {
        const newPage = event.selected;
        setCurrentPage(newPage);
        fetchData();
    };

    if (isLoading) {
        return <div>Cargando usuarios...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="mt-5 mx-5">
                <h2>Todas las solicitudes</h2>
            </div>
            <CardSolicitud
                dataUsers={dataUser}
                onDataUpdate={handleDataUpdate}
            />
            <div className="mt-16">
                <ReactPaginate
                    breakLabel={'...'}
                    nextLabel="Siguiente"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={totalPages}
                    previousLabel="Anterior"
                    renderOnZeroPageCount={null}
                    className="pagination"
                    forcePage={clampedForcePage}
                />
            </div>
        </div>
    )
}

export default ListadoSolicitudRoles
