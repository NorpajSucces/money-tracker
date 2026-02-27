import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}){
    //  Mengambil token dari localstorage
    const token = localStorage.getItem("access_token");

    // Jika tidak ada token, redirect ke halaman login
    if (!token){
        return <Navigate to="/" />
    }

    // Jika ada token, tampilkan halaman yang diminta
    return children;
}