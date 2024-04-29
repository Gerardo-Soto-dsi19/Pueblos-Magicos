// FileUpload.jsx
import React from 'react';
import { HiX } from 'react-icons/hi';

const FileUpload = ({ label, id, name, value, onChange, previewImage, handleRemoveImage }) => {
    return (
        <div className="col-span-full">
            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                            htmlFor={id}
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-[#6c1d45] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#6c1d45] focus-within:ring-offset-2 hover:text-[#6A294A]"
                        >
                            <span>Sube un archivo</span>
                            <input id={id} name={name} type="file" className="sr-only" onChange={onChange} />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            {previewImage && (
                <div className="mt-5 flex justify-center">
                    <div className="w-60 flex justify-center">
                        <div className="bg-white shadow-md rounded-md overflow-hidden">
                            <div className="relative">
                                <button
                                    className="absolute right-1 bg-white rounded-full p-1 hover:bg-gray-100"
                                    onClick={handleRemoveImage}
                                >
                                    <HiX />
                                </button>
                            </div>
                            <div className="">
                                <img src={URL.createObjectURL(previewImage)} alt="Preview" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;