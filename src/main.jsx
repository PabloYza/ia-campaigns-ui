import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId="522857786366-bmgfn0d84fb0n4p9d5qdk0td1unrhtoc.apps.googleusercontent.com">
        <App />
     </GoogleOAuthProvider>
  </StrictMode>,
)
