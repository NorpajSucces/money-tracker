import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import styles from './Auth.module.css';

export default function Register() {
    const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        if (form.password.length < 6) return 'Password minimal 6 karakter';
        if (form.password !== form.confirmPassword) return 'Password tidak cocok';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validate();
        if (validationError) return setError(validationError);

        setLoading(true);
        try {
            await api.post('/register', {
                username: form.username,
                password: form.password
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Register failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h2 className={styles.title}>💰 Money Tracker</h2>
                <p className={styles.subtitle}>Buat akun baru</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        placeholder="Username (min. 3 karakter)"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        minLength={3}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Password (min. 6 karakter)"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        placeholder="Konfirmasi Password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? 'Loading...' : 'Register'}
                    </button>
                </form>

                <p className={styles.link}>
                    Sudah punya akun? <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    );
}
