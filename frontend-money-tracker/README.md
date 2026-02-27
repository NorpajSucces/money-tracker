# Money Tracker — Frontend

Frontend aplikasi Money Tracker menggunakan **React** + **Vite**. Berkomunikasi dengan backend REST API untuk autentikasi dan manajemen transaksi.

## Fitur

- **Login & Register** — Form autentikasi pengguna
- **Dashboard** — Tampilkan saldo total dan daftar transaksi
- **Tambah Transaksi** — Form input transaksi baru (income/expense)
- **Edit Transaksi** — Ubah data transaksi yang sudah ada
- **Hapus Transaksi** — Delete transaksi
- **Protected Route** — Dashboard hanya bisa diakses setelah login
- **Logout** — Hapus token dan redirect ke login

## Teknologi

| Teknologi        | Fungsi                                       |
| ---------------- | -------------------------------------------- |
| React 19         | Library UI (functional components + hooks)   |
| Vite 7           | Build tool & dev server                      |
| React Router 7   | Client-side routing                          |
| Axios            | HTTP client untuk request ke API backend     |

## Struktur Folder

```
src/
├── pages/                         # Halaman utama
│   ├── Login.jsx                  # Form login
│   ├── Register.jsx               # Form register
│   └── Dashboard.jsx              # Dashboard (saldo + CRUD transaksi)
│
├── components/                    # Komponen reusable
│   ├── layout/
│   │   ├── Navbar.jsx             # Navigasi atas
│   │   └── Sidebar.jsx           # Sidebar navigasi
│   ├── transaction/
│   │   ├── TransactionForm.jsx    # Form tambah/edit transaksi
│   │   ├── TransactionList.jsx    # Daftar transaksi
│   │   └── TransactionItem.jsx    # Satu item transaksi
│   └── summary/
│       └── SummaryCard.jsx        # Kartu ringkasan saldo
│
├── services/
│   └── api.js                     # Axios instance + interceptor token
│
├── routes/
│   └── ProtectedRoute.jsx         # Guard: redirect ke login jika belum auth
│
├── context/
│   └── AuthContext.jsx            # React context untuk state autentikasi
│
├── hooks/
│   └── useAuth.js                 # Custom hook untuk akses auth context
│
├── utils/
│   └── formatCurrency.js          # Helper format angka ke Rupiah
│
├── App.jsx                        # Root component + routing
├── App.css                        # Styling utama
├── main.jsx                       # Entry point React
└── index.css                      # Global styles
```

## Routing

| Path         | Komponen    | Akses                                      |
| ------------ | ----------- | ------------------------------------------ |
| `/`          | Login       | Public                                     |
| `/register`  | Register    | Public                                     |
| `/dashboard` | Dashboard   | Protected (dibungkus `ProtectedRoute`)     |

## Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Dev Server

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

> **Catatan:** Pastikan backend sudah jalan di `http://localhost:3000` sebelum menggunakan frontend.

## Dokumentasi Lengkap

Lihat [`dokumentasi.md`](./dokumentasi.md) untuk penjelasan detail setiap file, konsep React yang digunakan, dan alur autentikasi dari sisi frontend.
