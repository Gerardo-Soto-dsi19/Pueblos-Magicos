import { Link } from "react-router-dom"

function Footer() {
    return (
        <>
            <footer className="bg-[#6C1D45] text-white py-4 px-8 text-sm font-['Roboto']" >
                <div className="flex md:flex-col md:items-center sm:flex-row sm:justify-between gap-10">
                    <div>
                        <h3 className="font-bold">INSTITUTO POLITÉCNICO NACIONAL</h3>
                    </div>
                    <div>
                        <p>D.R. Instituto Politécnico Nacional (IPN): Av. Luis Enrique Erro S/N, Unidad Profesional Adolfo López Mateos, Zacatenco, Alcaldía Gustavo A.</p>
                        <p>Madero, C.P. 07738, Ciudad de México. Conmutador: 55 57 29 60 00 / 55 57 29 63 00.</p>
                    </div>
                    <div>
                        <p>Esta página es una obra intelectual protegida por la Ley Federal del Derecho de Autor, puede ser reproducida con fines no lucrativos, siempre y</p>
                        <p>cuando no se mutile, se cite la fuente completa y su dirección electrónica; su uso para otros fines, requiere autorización previa y por escrito de</p>
                        <p>la Dirección General del Instituto.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
