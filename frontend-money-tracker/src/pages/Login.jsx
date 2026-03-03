import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import styles from './Auth.module.css';

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', form);
            login(response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h2 className={styles.title}>💰 Money Tracker</h2>
                <p className={styles.subtitle}>Login ke akun Anda</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <p className={styles.link}>
                    Belum punya akun? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}