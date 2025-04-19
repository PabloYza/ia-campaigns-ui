import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';

function LoginForm() {
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const login = useGoogleLogin({
		scope: 'https://www.googleapis.com/auth/adwords',
		access_type: 'offline',
		prompt: 'consent',
		onSuccess: async (codeResponse) => {
			try {
				const res = await axios.post("http://localhost:3001/google-auth/code", {
					code: codeResponse.code
				});

				console.log("✅ Tokens recibidos:", res.data);

				// Opcional: guardar el refresh_token en localStorage o Redux
				// localStorage.setItem('google_refresh_token', res.data.refresh_token);

				navigate("/clients", { replace: true });

			} catch (err) {
				console.error("❌ Error al intercambiar el code:", err.response?.data || err.message);
				alert("No se pudo autenticar correctamente con Google Ads.");
			}
		},
		onError: () => setError("Error al iniciar sesión con Google.")
	});




	return (
		<div style={{ height: '80dvh' }} className="flex items-center justify-center bg-gray-50 px-4">
			<div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-bold text-center">Iniciar sesión</h1>
				<p className="text-sm text-gray-500 text-center">
					Usa tu correo corporativo para acceder
				</p>
				<button
					onClick={login}
					className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
				>
					Acceder con Google
				</button>
				{error && <p className="text-sm text-red-500 text-center">{error}</p>}
			</div>
		</div>
	);
}

export default LoginForm;