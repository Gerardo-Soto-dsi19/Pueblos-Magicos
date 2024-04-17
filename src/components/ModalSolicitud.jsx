import { useEffect, useState } from 'react';
import { TextInput, Textarea, Label, Dropdown } from "flowbite-react"
import axios from 'axios';

import React from 'react';



function ModalSolicitud({ serviceId }) {
    const [puebloMagico, setPuebloMagico] = useState([])
    const [categoria, setCategoria] = useState([])
    const [estado, setEstado] = useState([])
    const [serviceData, setServiceData] = useState(null);


    /* Seteo de combos  */
    useEffect(() => {
        axios.get('http://localhost/api/tiposervicios')
            .then(response => {
                setCategoria(response.data.data)
            })
            .catch(error => {
                console.error('Error fetching states:', error);
            });
    }, []);


    useEffect(() => {
        axios.get('http://localhost/api/pueblosmagicos')
            .then(response => { setPuebloMagico(response.data.data) })
            .catch(error => {
                console.error('Error fetching pueblos:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost/api/catestados')
            .then(response => { setEstado(response.data.data) })
            .catch(error => {
                console.error('Error fetching estados:', error);
            });
    }, []);

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost/api/servicios/${serviceId}`, config);
                setServiceData(response.data.data.servicio[0]);
            } catch (e) {
                console.error('Error fetching service data: ', e);
            }
        };

        if (serviceId && serviceData === null) {
            fetchServiceData();
        }
    }, [serviceId, serviceData]);

    useEffect(() => {
    }, [serviceData]);

    if (!serviceData) {
        return <div>Cargando...</div>;
    }
    console.log(serviceData);
    return (
        <>

            <div className='md:flex justify-between'>
                <div className='mt-5 md:w-[50%]'>
                    <Label>Pueblo Mágico</Label>
                    <Dropdown label={serviceData.pueblo.nombre} dismissOnClick={false} color={'pink'}>
                        {puebloMagico.map((option) => (
                            <Dropdown.Item key={option.id} >{option.nombre}</Dropdown.Item>
                        ))}
                    </Dropdown>

                </div>
                <div className='mt-5 md:w-[50%]'>
                    <Label>Categoría</Label>
                    <Dropdown label={serviceData.tipo_servicio.servicio} dismissOnClick={false} color={'pink'}>
                        {categoria.map((option) => (
                            <Dropdown.Item key={option.id} value={option.id}>{option.servicio}</Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            </div>

            <div className='mt-5 block'>
                <Label>Título</Label>
                <TextInput
                    defaultValue={serviceData.detalle_servicio?.titulo ?? 'N/A'}></TextInput>
            </div>

            <div className='mt-5 block'>
                <Label>Descripción</Label>
                <Textarea
                    defaultValue={serviceData.detalle_servicio?.descripcion ?? 'N/A'}
                    rows={4} />
            </div>

            <div className='md:flex flex-row md:space-x-6'>
                <div className="w-full mt-5">
                    <Label>Días de servicio</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.dias_servicio ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de apertura</Label>
                    <TextInput type="time" defaultValue={serviceData.detalle_servicio?.horario.horario_inicio ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de cierre</Label>
                    <TextInput type="time" defaultValue={serviceData.detalle_servicio?.horario.horario_fin ?? 'N/A'} />
                </div>

            </div>
            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Precio</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.precios ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Latitud</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.coordenada.latitud ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Longitud</Label>
                    <TextInput type="text" defaultValue={serviceData.detalle_servicio?.coordenada.longitud ?? 'N/A'} />
                </div>
            </div>
            <div className="md:flex flex-row md:space-x-6">
                <div className="w-full mt-5">
                    <Label>Calle</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.calle ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Colonia</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.colonia ?? 'N/A'} />
                </div>
            </div>
            <div className='md:flex flex-row md:space-x-6'>
                <div className="w-full mt-5">
                    <Label>Alcaldía/Municipio</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.municipio ?? 'N/A'} />
                </div>
                <div className="w-full mt-5">
                    <Label>Estado</Label>
                    <Dropdown label={serviceData.direccion.estado.nombre} dismissOnClick={false} color={'pink'}>
                        {estado.map((option) => (
                            <Dropdown.Item key={option.id} value={option.id}>{option.nombre}</Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            </div>
            <div className="md:flex flex-row md:space-x-6">
                <div className="mt-5">
                    <Label>Código Postal</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.CP ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Núm. Int</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.int ?? 'N/A'} />
                </div>
                <div className="mt-5">
                    <Label>Núm. Ext</Label>
                    <TextInput type="text" defaultValue={serviceData.direccion?.ext ?? 'N/A'} />
                </div>
            </div>

        </>
    )
}

export default ModalSolicitud
