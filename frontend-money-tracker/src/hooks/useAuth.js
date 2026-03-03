import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook untuk mengakses AuthContext
 * Memastikan hook digunakan di dalam AuthProvider
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
