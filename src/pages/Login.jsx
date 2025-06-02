import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';
import { isAllowedDomain } from "@/auth/loginUtils";
import toast from "react-hot-toast";

function LoginForm() {
	const [error, setError] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const login = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				// 1. Usar el access_token para obtener la información del perfil de Google.
				const profile = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
					headers: {
						Authorization: `Bearer ${tokenResponse.access_token}`,
					},
				});

				const userData = profile.data;
				const userEmail = userData.email || "";

				// 2. Verificar si el dominio del correo es el permitido.
				if (!isAllowedDomain(userEmail)) {
					toast.error("Acceso denegado. Utiliza una cuenta de correo de NothingAD.");
					setError("Este correo no pertenece a la organización autorizada.");
					return;
				}

				// 3. Si el dominio es correcto, guardar datos de usuario en Redux.
				dispatch(setUser({
					name: userData.name || "",
					email: userEmail,
					picture: userData.picture || "",
				}));

				// 4. Redirigir al usuario a la lista de clientes.
				navigate("/clients", { replace: true });

			} catch (err) {
				console.error("❌ Error al verificar el perfil de Google:", err);
				setError("Error al procesar la autenticación.");
				toast.error("No se pudo verificar tu perfil de Google.");
			}
		},
		onError: () => {
			setError("Error al iniciar sesión con Google.");
			toast.error("Hubo un problema durante el inicio de sesión.");
		},
	});

	return (
		<div style={{ height: '80dvh' }} className="flex items-center justify-center bg-gray-50 px-4">
			<div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-bold text-center">Bienvenido</h1>
				<p className="text-sm text-gray-500 text-center">
					Usa tu cuenta de Google de NothingAD para acceder.
				</p>
				<button
					onClick={() => login()}
					className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
				>
					<svg className="w-5 h-5" viewBox="0 0 48 48">
						<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
						<path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
						<path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
						<path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.38,36.43,44,30.668,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
					</svg>
					Acceder con Google
				</button>
				{error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
			</div>
		</div>
	);
}

export default LoginForm;