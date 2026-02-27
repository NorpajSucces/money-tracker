import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {

    /*
      useState untuk menyimpan input form
    */
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    /*
       useNavigate untuk redirect halaman
    */
    const navigate = useNavigate();

    /*
      Fungsi ini dipanggil saat form disubmit
    */
    const handleSubmit = async (e) => {
        e.preventDefault(); // mencegah reload halaman

        try {

            /*
               Kirim request ke backend
              POST /api/login
            */
            const response = await api.post("/login", form);

            /*    
               Simpan token ke localStorage
            */
            localStorage.setItem("access_token", response.data.access_token);

            /*
               Redirect ke dashboard
            */
            navigate("/dashboard");

        } catch (error) {

            /*
               Jika login gagal
            */
            alert(error.response?.data?.error || "Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                />

                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <br />

                <button type="submit">Login</button>
            </form>

            <p>
                Belum punya akun? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}