import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext';
import axios from "axios"
import Swal from 'sweetalert2';
import { Spinner } from 'flowbite-react';
import { loginUser } from '../api/api'



function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const [formData, setFormData] = useState({
        'user_name': '',
        'password': ''
    });

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                await axios.get('http://localhost/sanctum/csrf-cookie', {

                });
            } catch (error) {
                Swal.fire('Error al conectarse', 'Hay un problema de conexión. Por favor, intenta de nuevo más tarde.', 'error')
            }
        };
        getCsrfToken();
    }, []);

    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === 'user_name' && value.trim() !== '') {
            const isValidEmail = validateEmail(value);
            if (isValidEmail) {
                setEmailError(null);
            } else {
                setEmailError('Dirección de correo electrónico inválida');
            }
        } else if (name === 'user_name' && value.trim() === '') {
            setEmailError(null);
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailPattern.test(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (emailError != null) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, ingrese un correo electrónico válido',
            });
            return;
        }
        setIsLoading(true);
        const dataToSend = {
            data: {
                user_name: formData.user_name,
                password: formData.password
            }
        };
        try {
            const response = await loginUser(dataToSend)
            if (response.status === 200) {
                sessionStorage.setItem('accessToken', response.data.access_token);
                localStorage.setItem('user_name', response.data.user.id);
                sessionStorage.setItem('tu', response.data.user.id_tipo_usuario)


                navigate('/gestor-solicitudes');
                setIsAuthenticated(true);
            } else {
                setIsLoading(false)
                setIsAuthenticated(false)
                return;
            }
        } catch (error) {
            if (error.response && error.response.data) {
                Swal.fire({
                    icon: 'error',
                    title: 'Credenciales incorrectas',
                    text: 'Nombre de usuario o contraseña no válidos',
                });
            }
        } finally {
            setIsLoading(false);
        }

    }
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="lds-ring">
                    <Spinner className="spinner-custom" size="xl" />
                </div>
            </div>
        );
    }

    return (

        <>
            <div className='md:flex justify-center items-center mt-10 sm: mx-10'>
                <div className=" bg-white shadow-lg md:w-96 rounded-lg mb-10">
                    <div className="flex min-h-full flex-1 flex-col justify-center py-4 lg:px-8 b">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className=' mx-auto'>
                                <img src="../logo-ipn-lema-vertical-color.png" />
                            </div>
                            <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Acceda a su cuenta
                            </h2>
                        </div>

                        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-screen">
                                    <div className="lds-ring">
                                        <span className="ml-2">Cargando...</span>
                                        <Spinner className="spinner-custom" size="xl" />
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="shadow-md rounded-lg py-10 px-5 mb-10 space-y-6" action="#" method="POST">
                                    <div>
                                        <label htmlFor="user_name" className="block text-sm font-medium leading-6 text-gray-900">
                                            Correo
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                name="user_name"
                                                type="email"
                                                value={formData.user_name}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                                                required
                                            />
                                            {emailError && <div className="text-red-500 mt-1">{emailError}</div>}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                Contraseña
                                            </label>
                                            <div className="text-sm">
                                                <Link to="/recuperar/contraseña" className="font-semibold text-zinc-900 hover:text-zinc-700">
                                                    ¿Olvidaste tu contraseña?
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password} onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-800 sm:text-sm sm:leading-6"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-[#6c1d45] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                                        >
                                            Ingresar
                                        </button>
                                    </div>
                                </form>
                            )}
                            <p className="mt-10 text-center text-sm text-gray-500">
                                ¿No tienes una cuenta?{' '}
                                <Link to="/registro/usuario" className="font-semibold leading-6 text-zinc-900 hover:text-zinc-700">
                                    ¡Regístrate aquí!
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default Login
