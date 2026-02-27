import axios from "axios";

// Membuat satu "axios instance" dengan konfigurasi default supaya tidak perlu tulis baseURL berulang-ulang
const api = axios.create({
    baseURL: "http://localhost:3000/api"
});

// Ini akan otomatis menambahkan token ke setiap request kalau token ada di localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api