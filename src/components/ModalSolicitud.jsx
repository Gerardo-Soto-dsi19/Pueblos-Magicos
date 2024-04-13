import { useState } from 'react';
import { Carousel, Modal, TextInput, Textarea, Dropdown, Label } from "flowbite-react"



function ModalSolicitud({ value }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Aquí puedes guardar el valor editado en tu estado o enviar al backend
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedValue(value);
        setIsEditing(false);
    };
    return (
        <>

            <div className='flex justify-between'>
                <Dropdown label="Dropdown button" dismissOnClick={false}>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Earnings</Dropdown.Item>
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>

                <Dropdown label="Dropdown button" dismissOnClick={false}>
                    <Dropdown.Item>Dashboard</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Earnings</Dropdown.Item>
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
            </div>
            <div className='mt-5 block'>
                <Label>Título</Label>
                <TextInput></TextInput>
            </div>

            <div className='mt-5 block'>
                <Label>Descripción</Label>
                <Textarea></Textarea>
            </div>

            <div className='flex flex-row space-x-6'>
                <div className="w-full mt-5">
                    <Label>Días de servicio</Label>
                    <TextInput type="text" />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de apertura</Label>
                    <TextInput type="time" />
                </div>
                <div className="w-full mt-5">
                    <Label>Horario de cierre</Label>
                    <TextInput type="time" />
                </div>

            </div>
            <div className="flex flex-row space-x-6">
                <div className="mt-5">
                    <Label>Precio</Label>
                    <TextInput type="text" />
                </div>
                <div className="mt-5">
                    <Label>Latitud</Label>
                    <TextInput type="text" />
                </div>
                <div className="mt-5">
                    <Label>Longitud</Label>
                    <TextInput type="text" />
                </div>
            </div>
            <div className="flex flex-row space-x-6">
                <div className="w-full mt-5">
                    <Label>Calle</Label>
                    <TextInput type="text" />
                </div>
                <div className="w-full mt-5">
                    <Label>Colonia</Label>
                    <TextInput type="text" />
                </div>
            </div>
            <div className='flex flex-row space-x-6'>
                <div className="w-full mt-5">
                    <Label>Alcaldía/Municipio</Label>
                    <TextInput type="text" />
                </div>
                <div className="w-full mt-5">
                    <Label>Estado</Label>
                    <Dropdown label="Dropdown button" dismissOnClick={false}>
                        <Dropdown.Item>Dashboard</Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Item>Earnings</Dropdown.Item>
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
            <div className="flex flex-row space-x-6">
                <div className="mt-5">
                    <Label>Código Postal</Label>
                    <TextInput type="text" />
                </div>
                <div className="mt-5">
                    <Label>Núm. Int</Label>
                    <TextInput type="text" />
                </div>
                <div className="mt-5">
                    <Label>Núm. Ext</Label>
                    <TextInput type="text" />
                </div>
            </div>

        </>
    )
}

export default ModalSolicitud
