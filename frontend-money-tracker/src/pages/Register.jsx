import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/register", form);

            alert("Register berhasil! Silahkan login.");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.error || "Register failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>

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

                <button type="submit">Register</button>
            </form>

            <p>
                Sudah punya akun? <Link to="/">Login</Link>
            </p>
        </div>
    );
}
