import Solicitud from "./Solicitud"


function ListadoSolicitudes() {
    return (
        <>
            <div className="md:h-screen overflow-y-scroll">
                <Solicitud/>
                <Solicitud/>
                <Solicitud/>
                <Solicitud/>
            </div>
        </>
    )
}

export default ListadoSolicitudes
