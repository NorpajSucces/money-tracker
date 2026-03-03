import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Melindungi route dari akses tanpa autentikasi.
 * Jika tidak login, redirect ke halaman login.
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" replace />;
}