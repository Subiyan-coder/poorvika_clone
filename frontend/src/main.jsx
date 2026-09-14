import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css';
import App from './App.jsx';
import AuthProvider from "./context/AuthProvider";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

        <AuthProvider>
            
          <App /> 

        </AuthProvider>

        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,

                style: {
                    background: "#111827",
                    color: "#ffffff",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "14px",
                },

                success: {
                    iconTheme: {
                        primary: "#22c55e",
                        secondary: "#ffffff",
                    },
                },

                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                    },
                },
            }}
        />

    </BrowserRouter>
  </StrictMode>,
);
