import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function LoginForm() {
    const [error, setError] = useState("");
  
    const login = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        try {
          const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          });
        } catch (err) {
          setError("Error al verificar el correo.");
        }
      },
      onError: () => setError("Error al iniciar sesión con Google."),
    });
  
    return (
        <div className="flex-1 flex justify-center items-center px-4 sm:px-8 ">
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