# Money Tracker — Fullstack Application

Aplikasi pencatatan keuangan pribadi (income & expense) yang dibangun dengan arsitektur **fullstack** — backend REST API dan frontend React SPA.

## Fitur Utama

- **Register & Login** — Autentikasi user menggunakan JWT
- **CRUD Transaksi** — Tambah, lihat, edit, dan hapus transaksi
- **Ringkasan Saldo** — Total balance otomatis dihitung (income - expense)
- **Proteksi Halaman** — Dashboard hanya bisa diakses setelah login
- **Logout** — Hapus sesi dan kembali ke halaman login

## Tech Stack

| Layer        | Teknologi                                             |
| ------------ | ----------------------------------------------------- |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt   |
| **Frontend** | React, Vite, Axios, React Router                      |

## Struktur Projek

```
money-tracker/
├── backend-money-tracker/         # REST API (Express + MongoDB)
│   ├── controllers/               # Logic bisnis (auth, transaksi)
│   ├── middlewares/               # Authentication & error handler
│   ├── models/                    # Schema MongoDB (User, Transaction)
│   ├── routes/                    # Endpoint routing
│   ├── helpers/                   # Utility functions
│   ├── index.js                   # Entry point server
│   ├── README.md                  # Dokumentasi backend
│   └── dokumentasi.md             # Dokumentasi belajar backend
│
├── frontend-money-tracker/        # React SPA (Vite)
│   ├── src/
│   │   ├── pages/                 # Halaman (Login, Register, Dashboard)
│   │   ├── components/            # Komponen reusable
│   │   ├── services/              # Axios instance & interceptor
│   │   ├── routes/                # Protected route
│   │   ├── context/               # React context (Auth)
│   │   ├── hooks/                 # Custom hooks
│   │   └── utils/                 # Helper functions
│   ├── README.md                  # Dokumentasi frontend
│   └── dokumentasi.md             # Dokumentasi belajar frontend
│
└── README.md                      # Dokumentasi keseluruhan (file ini)
```

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/NorpajSucces/money-tracker.git
cd money-tracker
```

### 2. Jalankan Backend

```bash
cd backend-money-tracker
npm install
cp .env.example .env        # Isi MONGO_URI, JWT_SECRET, PORT
npm run dev                  # Server di http://localhost:3000
```

### 3. Jalankan Frontend

```bash
cd frontend-money-tracker
npm install
npm run dev                  # Buka di http://localhost:5173
```

> **Catatan:** Pastikan backend sudah jalan sebelum membuka frontend, karena frontend mengambil data dari API backend.

## Dokumentasi Lengkap

| Bagian                       | File                                                              | Isi                                                          |
| ---------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| Backend — Quick Reference    | [`backend-money-tracker/README.md`](./backend-money-tracker/README.md)           | API endpoints, cara pakai, tech stack           |
| Backend — Dokumentasi Belajar| [`backend-money-tracker/dokumentasi.md`](./backend-money-tracker/dokumentasi.md)  | Arsitektur MVC, MongoDB, JWT, penjelasan file   |
| Frontend — Quick Reference   | [`frontend-money-tracker/README.md`](./frontend-money-tracker/README.md)         | Fitur, struktur, routing, cara pakai            |
| Frontend — Dokumentasi Belajar| [`frontend-money-tracker/dokumentasi.md`](./frontend-money-tracker/dokumentasi.md)| React hooks, Axios, protected route, file guide |

## Catatan Penting

- File `.env` **tidak boleh di-push** ke GitHub (berisi credential rahasia).
- Gunakan `.env.example` sebagai template untuk developer lain.
- Pastikan MongoDB sudah aktif (lokal atau Atlas) sebelum menjalankan backend.
- Ini adalah project based learning
