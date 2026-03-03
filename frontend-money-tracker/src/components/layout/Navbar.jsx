import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={styles.navbar}>
            <span className={styles.brand}>💰 Money Tracker</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}
