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
		flow: 'auth-code',
		scope: 'https://www.googleapis.com/auth/adwords',
		access_type: 'offline',
		prompt: 'consent',
		onSuccess: async (codeResponse) => {
			console.log("📦 CODE:", codeResponse.code);
			try {
				const res = await axios.post("http://localhost:3001/google-auth/code", {
					code: codeResponse.code,
				});

				const { access_token, refresh_token, expires_in } = res.data;

				// ✅ Guardar localmente
				localStorage.setItem("google_ads_token", JSON.stringify({
					access_token,
					refresh_token,
					expires_at: Date.now() + expires_in * 1000,
				}));

				// ✅ Obtener perfil de usuario
				const profile = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				});

				const userData = profile.data;

				dispatch(setUser({
					name: userData.name || "",
					email: userData.email || "",
					picture: userData.picture || "",
				}));

				navigate("/clients", { replace: true });

			} catch (err) {
				console.error("❌ Error al verificar Google Auth:", err);
				setError("Error al procesar la autenticación.");
			}
		},
		onError: () => setError("Error al iniciar sesión con Google."),
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