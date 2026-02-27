# Dokumentasi Lengkap — Frontend Money Tracker

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Konsep React yang Digunakan](#2-konsep-react-yang-digunakan)
3. [Alur Autentikasi di Frontend](#3-alur-autentikasi-di-frontend)
4. [Penjelasan Setiap File](#4-penjelasan-setiap-file)
5. [Alur Halaman (User Flow)](#5-alur-halaman-user-flow)

---

## 1. Gambaran Umum

Frontend Money Tracker adalah **Single Page Application (SPA)** yang dibangun dengan React. Aplikasi ini tidak me-reload halaman saat berpindah page — hanya konten yang berubah.

### Apa saja yang dilakukan frontend?

| Fitur              | Penjelasan                                               |
| ------------------ | -------------------------------------------------------- |
| Login & Register   | Mengirim data ke backend, menyimpan token                |
| Dashboard          | Menampilkan saldo + daftar transaksi dari API            |
| CRUD Transaksi     | Tambah, edit, hapus transaksi via API                    |
| Proteksi Route     | Cek token sebelum izinkan akses dashboard                |
| Logout             | Hapus token, redirect ke login                           |

### Bagaimana frontend berkomunikasi dengan backend?

```
+-------------------+          HTTP Request          +-------------------+
|                   |  ----------------------------> |                   |
|    FRONTEND       |      (GET, POST, PUT, DELETE)  |    BACKEND        |
|    (React)        |                                |    (Express)      |
|    Port 5173      |  <---------------------------- |    Port 3000      |
|                   |          JSON Response         |                   |
+-------------------+                                +-------------------+
```

Frontend mengirim request menggunakan **Axios** ke backend, dan backend membalas dengan **JSON**.

---

## 2. Konsep React yang Digunakan

### 2.1 Functional Component

Semua komponen di projek ini menggunakan **function**, bukan class.

```jsx
// Functional component (yang kita pakai)
export default function Login() {
    return <div>Login Page</div>;
}
```

**Kenapa functional?**

- Lebih singkat dan mudah dibaca
- Bisa pakai React Hooks
- Standard modern React

### 2.2 useState — Menyimpan Data di Komponen

`useState` digunakan untuk menyimpan data yang **bisa berubah** di dalam komponen.

```jsx
const [form, setForm] = useState({
    username: "",
    password: ""
});
```

| Bagian           | Penjelasan                            |
| ---------------- | ------------------------------------- |
| `form`           | Variabel yang menyimpan nilai saat ini |
| `setForm`        | Fungsi untuk mengubah nilai `form`     |
| `useState({...})`| Nilai awal `form`                      |

**Analogi:** `useState` seperti **papan tulis** — kamu bisa tulis (`setForm`) dan baca (`form`) kapan saja.

### 2.3 useEffect — Jalankan Kode Saat Komponen Muncul

`useEffect` digunakan untuk menjalankan "efek samping" — seperti **mengambil data dari API**.

```jsx
useEffect(() => {
    fetchData();  // dipanggil saat komponen pertama kali muncul
}, []);           // [] = hanya sekali saat mount
```

| Dependency       | Kapan Dijalankan                            |
| ---------------- | ------------------------------------------- |
| `[]` (kosong)    | **Sekali** saat komponen pertama kali muncul |
| `[value]`        | Setiap kali `value` berubah                  |
| Tanpa `[]`       | **Setiap render** (jarang dipakai)           |

### 2.4 useNavigate — Pindah Halaman

```jsx
const navigate = useNavigate();
navigate("/dashboard");  // redirect ke dashboard
```

Berbeda dengan `<a href>` (reload penuh), `useNavigate` berpindah halaman **tanpa reload** — ciri khas SPA.

### 2.5 Props — Mengirim Data ke Komponen Anak

```jsx
// Parent
<ProtectedRoute>
    <Dashboard />
</ProtectedRoute>

// ProtectedRoute menerima props "children"
function ProtectedRoute({ children }) {
    return children;  // menampilkan <Dashboard />
}
```

`children` adalah **apa pun** yang ditulis di antara tag pembuka dan penutup komponen.

---

## 3. Alur Autentikasi di Frontend

### 3.1 Alur Login

```
User isi form (username & password)
    |
    v
handleSubmit() -> api.post("/login", form)
    |
    v
Backend kirim { access_token: "eyJh..." }
    |
    v
localStorage.setItem("access_token", token)  <- simpan token
    |
    v
navigate("/dashboard")  <- redirect ke dashboard
```

### 3.2 Bagaimana Token Dipakai?

Setiap kali frontend mengirim request ke backend, token **otomatis disisipkan** di header oleh Axios interceptor:

```jsx
// services/api.js
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**Analogi:** Interceptor seperti **stempel otomatis** — setiap surat (request) yang keluar, otomatis distempel (ditambah token) sebelum dikirim.

### 3.3 Protected Route

```jsx
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to="/" />;  // tidak ada token -> ke login
    }

    return children;  // ada token -> tampilkan halaman
}
```

**Alur:**

```
User akses /dashboard
    |
    v
ProtectedRoute cek -> ada token? ---- Ya --> Tampilkan Dashboard
                                |
                              Tidak
                                |
                                v
                        Redirect ke Login
```

### 3.4 Logout

```jsx
const handleLogout = () => {
    localStorage.removeItem("access_token");  // hapus token
    navigate("/");                             // redirect ke login
};
```

Setelah token dihapus, `ProtectedRoute` akan menolak akses ke dashboard.

---

## 4. Penjelasan Setiap File

### 4.1 `main.jsx` — Entry Point

File pertama yang dijalankan React. Membungkus `<App />` dengan `<BrowserRouter>` agar routing bisa berfungsi.

```jsx
<BrowserRouter>
    <App />
</BrowserRouter>
```

### 4.2 `App.jsx` — Root Component & Routing

Mendefinisikan semua halaman dan route-nya:

```jsx
<Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    } />
</Routes>
```

| Path         | Komponen    | Proteksi              |
| ------------ | ----------- | --------------------- |
| `/`          | Login       | Tidak (public)        |
| `/register`  | Register    | Tidak (public)        |
| `/dashboard` | Dashboard   | Ya (butuh token)      |

### 4.3 `pages/Login.jsx` — Halaman Login

| Bagian           | Penjelasan                                              |
| ---------------- | ------------------------------------------------------- |
| `form` state     | Menyimpan input username & password                      |
| `handleSubmit`   | Kirim POST ke `/api/login`, simpan token, redirect       |
| Link ke Register | Navigasi ke `/register` jika belum punya akun           |

### 4.4 `pages/Register.jsx` — Halaman Register

| Bagian           | Penjelasan                                              |
| ---------------- | ------------------------------------------------------- |
| `form` state     | Menyimpan input username & password                      |
| `handleSubmit`   | Kirim POST ke `/api/register`, alert sukses, redirect    |
| Link ke Login    | Navigasi ke `/` jika sudah punya akun                   |

### 4.5 `pages/Dashboard.jsx` — Halaman Utama

Halaman ini adalah **paling kompleks** karena menggabungkan banyak fitur:

| Bagian             | Penjelasan                                               |
| ------------------ | -------------------------------------------------------- |
| `transactions`     | Array berisi semua transaksi dari API                    |
| `balance`          | Total saldo (dari endpoint `/summary`)                   |
| `form`             | Input form untuk tambah/edit transaksi                   |
| `editingId`        | ID transaksi yang sedang di-edit (null jika mode tambah) |
| `fetchData()`      | Ambil data transaksi dan saldo dari backend              |
| `handleSubmit()`   | Kirim POST (tambah) atau PUT (edit) ke backend           |
| `handleEdit(trx)`  | Isi form dengan data transaksi yang dipilih              |
| `handleCancelEdit()`| Batal edit, reset form                                  |
| `handleDelete(id)` | Kirim DELETE ke backend                                  |
| `handleLogout()`   | Hapus token, redirect ke login                           |

**Alur mode form:**

```
editingId === null  -> Mode TAMBAH -> tombol "Add"
editingId !== null  -> Mode EDIT   -> tombol "Update" + "Cancel"
```

### 4.6 `services/api.js` — Axios Instance

```jsx
const api = axios.create({
    baseURL: "http://localhost:3000/api"
});
```

**Kenapa pakai Axios instance?**

- `baseURL` tidak perlu ditulis berulang — cukup `api.get("/transactions")`
- Interceptor otomatis tambahkan token ke semua request

### 4.7 `routes/ProtectedRoute.jsx` — Guard Route

Komponen pembungkus yang mengecek token sebelum menampilkan halaman. Sudah dijelaskan di [bagian 3.3](#33-protected-route).

### 4.8 `context/AuthContext.jsx` — State Global Autentikasi

React Context digunakan untuk **berbagi data** antar komponen tanpa harus passing props berkali-kali (prop drilling).

### 4.9 `hooks/useAuth.js` — Custom Hook

Custom hook untuk mengakses AuthContext dengan lebih mudah:

```jsx
const { user, token } = useAuth();
```

### 4.10 `utils/formatCurrency.js` — Format Angka ke Rupiah

Helper function untuk menampilkan angka dalam format mata uang Indonesia:

```
5000000 -> "Rp 5.000.000"
```

### 4.11 Komponen Reusable (`components/`)

| Komponen          | Lokasi                           | Fungsi                           |
| ----------------- | -------------------------------- | -------------------------------- |
| Navbar            | `layout/Navbar.jsx`              | Bar navigasi di bagian atas      |
| Sidebar           | `layout/Sidebar.jsx`             | Panel navigasi di samping        |
| TransactionForm   | `transaction/TransactionForm.jsx`| Form input transaksi             |
| TransactionList   | `transaction/TransactionList.jsx`| Daftar semua transaksi           |
| TransactionItem   | `transaction/TransactionItem.jsx`| Satu item di daftar transaksi    |
| SummaryCard       | `summary/SummaryCard.jsx`        | Kartu menampilkan total saldo    |

---

## 5. Alur Halaman (User Flow)

```
                    +--------------------+
                    |   Buka Aplikasi    |
                    +---------+----------+
                              |
                              v
                    +--------------------+
              +-----|   Login Page       |-----+
              |     +--------------------+     |
              |                                |
         Klik Register                    Submit Login
              |                                |
              v                                v
    +--------------------+          +----------------------+
    |  Register Page     |          |  Simpan Token        |
    |  (buat akun)       |          |  ke localStorage     |
    +---------+----------+          +---------+------------+
              |                               |
         Register OK                          |
              |                               v
              v                     +-------------------------+
     Redirect ke Login              |    Dashboard             |
                                    |                          |
                                    |  +-- Total Balance --+   |
                                    |  |  Rp 4.975.000     |   |
                                    |  +-------------------+   |
                                    |                          |
                                    |  +-- Add/Edit Form --+   |
                                    |  |  Title, Amount,    |  |
                                    |  |  Type, Submit      |  |
                                    |  +-------------------+   |
                                    |                          |
                                    |  +-- Transactions ---+   |
                                    |  |  Gaji  +5.000.000 |   |
                                    |  |  [Edit] [Delete]  |   |
                                    |  |  Kopi  -25.000    |   |
                                    |  |  [Edit] [Delete]  |   |
                                    |  +-------------------+   |
                                    |                          |
                                    |  [Logout]                |
                                    +------------+-------------+
                                                 |
                                            Klik Logout
                                                 |
                                                 v
                                        Hapus token ->
                                        Redirect ke Login
```

---

> Dokumentasi ini dibuat untuk memudahkan pemahaman alur kerja frontend Money Tracker — dari bagaimana user login, data ditampilkan, hingga transaksi dikelola.
