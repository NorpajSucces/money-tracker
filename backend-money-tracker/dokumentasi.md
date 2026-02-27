# 📒 Dokumentasi Lengkap — CRUD Backend Money Tracker

---

## Daftar Isi

1. [Gambaran Umum Projek](#1-gambaran-umum-projek)
2. [Arsitektur MVC](#2-arsitektur-mvc)
3. [Alur Kerja Aplikasi (Request Flow)](#3-alur-kerja-aplikasi-request-flow)
4. [Penjelasan MongoDB & Mongoose](#4-penjelasan-mongodb--mongoose)
5. [Penjelasan Autentikasi (Register, Login, JWT)](#5-penjelasan-autentikasi-register-login-jwt)
6. [Penjelasan Setiap File](#6-penjelasan-setiap-file)
7. [Daftar Endpoint API](#7-daftar-endpoint-api)
8. [Contoh Penggunaan dengan Postman](#8-contoh-penggunaan-dengan-postman)

---

## 1. Gambaran Umum Projek

**CRUD Backend Money Tracker** adalah aplikasi backend untuk mencatat pemasukan dan pengeluaran uang. Aplikasi ini dibangun dengan:

- **Node.js** + **Express.js** → sebagai server dan framework web
- **MongoDB** → sebagai database untuk menyimpan data
- **Mongoose** → sebagai "jembatan" antara Express dan MongoDB

### Apa saja yang bisa dilakukan?

| Fitur | Penjelasan Singkat |
|-------|--------------------|
| Register & Login | User membuat akun, lalu login untuk dapat "token" |
| Autentikasi JWT | Setiap akses data transaksi harus pakai token |
| Create | Tambah transaksi baru (pemasukan / pengeluaran) |
| Read | Lihat semua transaksi atau salah satu berdasarkan ID |
| Update | Ubah data transaksi yang sudah ada |
| Delete | Hapus transaksi |
| Summary | Lihat total saldo (pemasukan dikurangi pengeluaran) |

---

## 2. Arsitektur MVC

Projek ini menggunakan pola **MVC (Model - View - Controller)**, tapi karena ini API backend saja (tanpa tampilan), bagian **View** digantikan oleh **response JSON**.

```
      ┌───────────────────────────────────────────────────────┐
      │                   Arsitektur MVC                      │
      │                                                       │
      │   Client (Postman)                                    │
      │       │                                               │
      │       ▼                                               │
      │   ┌────────────┐                                      │
      │   │  Routes     │  ← Menerima request, arahkan ke     │
      │   │  (Pelayan)  │    controller yang tepat            │
      │   └─────┬──────┘                                      │
      │         │                                             │
 <!-- │    ▼                                                  │ -->
      │   ┌────────────────┐                                  │
      │   │  Controller     │  ← Mengolah logika bisnis       │
      │   │  (Koki)         │    (apa yang harus dilakukan?)  │
      │   └─────┬──────────┘                                  │
      │         │                                             │
      │         ▼                                             │
      │   ┌────────────────┐                                  │
      │   │  Model          │  ← Aturan bentuk data + akses   │
      │   │  (Resep)        │    ke database MongoDB          │
      │   └────────────────┘                                  │
      └───────────────────────────────────────────────────────┘
```

### Analogi Sederhana (Restoran)

| Komponen | Analogi | Tugas |
|----------|---------|-------|
| `routes/` | **Pelayan** | Menerima pesanan (request) dari pelanggan, lalu diteruskan ke koki |
| `controllers/` | **Koki** | Mengolah pesanan — menentukan apa yang harus dilakukan |
| `models/` | **Resep** | Aturan bahan & bentuk masakan — aturan bentuk data di database |
| `middlewares/` | **Satpam** | Memeriksa apakah pelanggan boleh masuk (punya token?) |
| `helpers/` | **Alat bantu** | Pisau, spatula — fungsi kecil yang membantu koki bekerja |
| `index.js` | **Pintu masuk** | Tempat restoran dibuka dan semua dijalankan |

---

## 3. Alur Kerja Aplikasi (Request Flow)

Ketika user mengirim request ke server, ini yang terjadi **langkah demi langkah**:

```
 Client (Postman / Browser)
       │
       │  HTTP Request (GET/POST/PUT/DELETE)
       ▼
 ┌─────────────────────────────────────────────────────┐
 │  index.js                                           │
 │  1. express.json() → Parse body JSON dari request   │
 │  2. app.use('/api', router) → Arahkan ke routes     │
 └──────────────────┬──────────────────────────────────┘
                    │
                    ▼
 ┌───────────────────────────────────────────────────────┐
 │  routes/index.js                                      │
 │                                                       │
 │  ┌─ /register ─┐                                      │
 │  │  /login     │ → LANGSUNG ke authController         │
 │  └─────────────┘   (tidak perlu login dulu)           │
 │                                                       │
 │  ── authentication middleware ──                      │
 │  (cek token JWT, hanya yang sudah login boleh lewat)  │
 │                                                       │
 │  ┌─ /transactions/* ─┐                                │
 │  │  GET, POST,       │ → ke transactionsController    │
 │  │  PUT, DELETE      │   (butuh token)                │
 │  └───────────────────┘                                │
 └──────────────────┬────────────────────────────────────┘
                    │
                    ▼
 ┌─────────────────────────────────────────────────────┐
 │  Controller                                         │
 │  Proses logika bisnis + akses MongoDB via Mongoose  │
 └───────────┬───────────────────────┬─────────────────┘
             │                       │
        ✅ Sukses               ❌ Error
             │                       │
             ▼                       ▼
      Response JSON           errorHandler middleware
      ke Client               → Response error JSON
                                 ke Client
```

### Penjelasan Langkah

1. **Client mengirim request** — misalnya `POST /api/transactions`
2. **`index.js`** menerima request → `express.json()` membaca body JSON
3. **`routes/index.js`** mengarahkan:
   - `/register` atau `/login` → langsung ke **authController** (tanpa token)
   - `/transactions/*` → melewati **authentication middleware** dulu
4. **Authentication middleware** mengecek:
   - Apakah ada header `Authorization`?
   - Apakah token JWT-nya valid?
   - Apakah user-nya masih ada di database?
5. **Controller** memproses request (baca/tulis/update/hapus data ke MongoDB)
6. Jika **sukses** → kirim response JSON ke client
7. Jika **error** → dikirim ke `errorHandler` middleware → response error ke client

---

## 4. Penjelasan MongoDB & Mongoose

### 4.1 Apa itu MongoDB?

**MongoDB** adalah database **NoSQL** yang menyimpan data dalam bentuk **dokumen JSON**.

Bedanya dengan database SQL (seperti MySQL):

| Istilah SQL | Istilah MongoDB | Penjelasan |
|-------------|----------------|-------------|
| Database | Database | Tempat menyimpan semua data |
| Tabel | **Collection** | Kumpulan data sejenis (misalnya: semua transaksi) |
| Baris (Row) | **Document** | Satu entri data (misalnya: satu transaksi) |
| Kolom (Column) | **Field** | Atribut data (misalnya: `title`, `amount`) |

**Contoh satu document transaksi di MongoDB:**

```json
{
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "title": "Gaji Bulanan",
    "amount": 5000000,
    "type": "income",
    "userId": "65a1b2c3d4e5f6a7b8c9d0e2",
    "createdAt": "2026-02-26T03:00:00.000Z",
    "updatedAt": "2026-02-26T03:00:00.000Z"
}
```

> **`_id`** adalah ID unik yang otomatis dibuat MongoDB untuk setiap document.

### 4.2 Apa itu Mongoose?

**Mongoose** adalah library **ODM (Object Data Modeling)** — "jembatan" antara Express.js dan MongoDB.

**Analogi:** Kalau MongoDB adalah **gudang**, maka Mongoose adalah **petugas gudang** yang:

| Yang Dilakukan | Method Mongoose | Contoh |
|----------------|-----------------|--------|
| Mengatur aturan barang | `Schema` | Field apa saja yang boleh masuk, tipe data-nya apa |
| Menyimpan barang baru | `.create()` | Buat transaksi baru |
| Mencari barang | `.find()`, `.findOne()`, `.findById()` | Cari semua transaksi, cari satu transaksi |
| Mengubah barang | `.findOneAndUpdate()` | Update data transaksi |
| Menghapus barang | `.findOneAndDelete()` | Hapus transaksi |

### 4.3 Koneksi ke MongoDB

Di file `index.js`, koneksi ke MongoDB dilakukan seperti ini:

```javascript
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err);
  });
```

**Cara bacanya:**

1. `mongoose.connect(MONGO_URI)` → coba terhubung ke MongoDB pakai URI dari file `.env`
2. Kalau **berhasil** (`.then`) → jalankan server Express di port yang ditentukan
3. Kalau **gagal** (`.catch`) → tampilkan pesan error

> ⚠️ **Server baru jalan SETELAH MongoDB terhubung.** Ini sengaja supaya tidak ada request masuk saat database belum siap.

Projek ini mendukung **dua opsi** koneksi MongoDB — pilih salah satu:

#### 4.3.1 Opsi A — MongoDB Lokal

Jika MongoDB sudah terinstall di komputer, cukup gunakan URI lokal:

```env
MONGO_URI=mongodb://127.0.0.1:27017/money-tracker
```

| Bagian | Penjelasan |
|--------|------------|
| `mongodb://` | Protokol koneksi MongoDB |
| `127.0.0.1:27017` | Alamat lokal (`localhost`) dan port default MongoDB |
| `/money-tracker` | Nama database (akan otomatis dibuat jika belum ada) |

#### 4.3.2 Opsi B — MongoDB Atlas (Cloud)

**MongoDB Atlas** adalah layanan MongoDB di cloud (gratis untuk tier dasar). Data disimpan di server MongoDB, bukan di komputer lokal — jadi bisa diakses dari mana saja.

**Langkah-langkah Setup MongoDB Atlas:**

**Step 1 — Buat Akun & Project**

1. Buka [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Klik **"Try Free"** → daftar akun (bisa pakai Google)
3. Buat project baru (misal: `money-tracker`)

**Step 2 — Buat Cluster (Database Server)**

1. Di halaman project, klik **"Build a Database"**
2. Pilih **M0 (Free)** → gratis, cukup untuk belajar dan development
3. Pilih **Provider** (AWS/Google Cloud/Azure) dan **Region** terdekat (misal: Singapore)
4. Klik **"Create Deployment"**

**Step 3 — Buat Database User**

1. Akan muncul form untuk membuat user database
2. Isi **Username** dan **Password**
   - ⚠️ **Catat password ini!** Akan dipakai di connection string
   - Hindari karakter khusus (`@`, `#`, `%`) di password agar tidak error saat di URI
3. Klik **"Create Database User"**

**Step 4 — Atur Network Access (IP Whitelist)**

1. Buka menu **Network Access** di sidebar
2. Klik **"Add IP Address"**
3. Pilih **"Allow Access from Anywhere"** (`0.0.0.0/0`) untuk development
   - ⚠️ Untuk production, sebaiknya batasi hanya IP server yang diizinkan
4. Klik **"Confirm"**

**Step 5 — Dapatkan Connection String**

1. Kembali ke halaman **Database** → klik **"Connect"** pada cluster
2. Pilih **"Drivers"**
3. Pastikan Driver: **Node.js**, Version: yang terbaru
4. Copy connection string, formatnya seperti ini:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

**Step 6 — Pasang di File `.env`**

Ganti `<username>`, `<password>`, dan `<dbname>` dengan nilai asli:

```env
MONGO_URI=mongodb+srv://budi:password123@cluster0.abc12.mongodb.net/money-tracker?retryWrites=true&w=majority
```

| Bagian | Penjelasan |
|--------|------------|
| `mongodb+srv://` | Protokol koneksi Atlas (menggunakan SRV untuk auto-discover server) |
| `budi:password123` | Username dan password database user yang dibuat di Step 3 |
| `@cluster0.abc12.mongodb.net` | Alamat cluster Atlas (unik per akun) |
| `/money-tracker` | Nama database (otomatis dibuat kalau belum ada) |
| `?retryWrites=true&w=majority` | Opsi koneksi — retry otomatis jika gagal tulis |

#### 4.3.3 Perbandingan Lokal vs Atlas

| Aspek | MongoDB Lokal | MongoDB Atlas |
|-------|---------------|---------------|
| **Instalasi** | Harus install MongoDB di komputer | Tidak perlu install, langsung di cloud |
| **Akses** | Hanya bisa dari komputer sendiri | Bisa dari mana saja (laptop, server, dll) |
| **Harga** | Gratis | Gratis (tier M0), berbayar untuk skala besar |
| **Setup** | Jalankan `mongod` di terminal | Buat akun → buat cluster → dapat URI |
| **Cocok untuk** | Development lokal | Development, staging, production |
| **Data hilang?** | Kalau komputer bermasalah, data bisa hilang | Data aman di cloud, ada backup otomatis |
| **URI di `.env`** | `mongodb://127.0.0.1:27017/money-tracker` | `mongodb+srv://user:pass@cluster.mongodb.net/money-tracker` |

> 💡 **Tips:** Untuk belajar, boleh mulai dari lokal. Tapi kalau mau deploy atau kolaborasi, gunakan Atlas agar data bisa diakses di mana saja.

### 4.4 Schema & Model

Schema itu **aturan** bentuk data yang akan disimpan. Model itu **alat** untuk berinteraksi dengan collection di MongoDB.

#### Model User (`models/user.js`)

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,      // Tipe data: String (teks)
    required: true,    // Wajib diisi
    unique: true       // Tidak boleh ada username yang sama
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });  // Otomatis tambahkan createdAt & updatedAt
```

**Penjelasan:**

- `type: String` → field ini harus berisi teks
- `required: true` → field ini wajib diisi, kalau kosong akan error
- `unique: true` → username harus unik, tidak boleh duplikat
- `timestamps: true` → Mongoose otomatis menambah field `createdAt` dan `updatedAt`

#### Model Transaction (`models/Transaction.js`)

```javascript
const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"]
  },
  type: {
    type: String,
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be income or expense'
    },
    required: [true, "Type is required"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });
```

**Penjelasan setiap field:**

| Field | Tipe | Aturan | Penjelasan |
|-------|------|--------|------------|
| `title` | String | Wajib diisi | Nama/judul transaksi, misal: "Gaji", "Beli Kopi" |
| `amount` | Number | Wajib diisi | Nominal uang, misal: 5000000 |
| `type` | String | Wajib, hanya `income` atau `expense` | Jenis transaksi: pemasukan atau pengeluaran |
| `userId` | ObjectId | Wajib, referensi ke User | ID pemilik transaksi — menghubungkan transaksi dengan user |

**Tentang `userId` (Relasi antar Collection):**

- `type: mongoose.Schema.Types.ObjectId` → tipe data khusus MongoDB untuk menyimpan ID
- `ref: 'User'` → field ini merujuk ke collection **User**
- Gunanya: **setiap transaksi milik satu user** → user A tidak bisa melihat transaksi user B

---

## 5. Penjelasan Autentikasi (Register, Login, JWT)

### 5.1 Alur Register

```
Client                         Server                        MongoDB
  │                              │                              │
  │  POST /api/register          │                              │
  │  { username, password }      │                              │
  │ ───────────────────────────► │                              │
  │                              │                              │
  │                              │ 1. Hash password             │
  │                              │    bcrypt.hash("budi123")    │
  │                              │    → "$2a$10$Xk9j..."        │
  │                              │                              │
  │                              │ 2. Simpan ke database        │
  │                              │ ───────────────────────────► │
  │                              │                              │
  │                              │ 3. Berhasil ✅               │
  │                              │ ◄──────────────────────────  │
  │                              │                              │
  │  Response: { message, user } │                              │
  │ ◄─────────────────────────── │                              │
```

**Langkah-langkah:**

1. Client mengirim `username` dan `password`
2. Password di-**hash** (dienkripsi satu arah) menggunakan `bcryptjs`
   - Input: `"budi123"`
   - Output: `"$2a$10$Xk9jLm8pQ..."`
   - **Password asli tidak pernah disimpan** di database
3. User disimpan ke MongoDB dengan password yang sudah di-hash

### 5.2 Alur Login

```
Client                         Server                        MongoDB
  │                              │                              │
  │  POST /api/login             │                              │
  │  { username, password }      │                              │
  │ ───────────────────────────► │                              │
  │                              │ 1. Cari user di database     │
  │                              │ ───────────────────────────► │
  │                              │ ◄──────────────────────────  │
  │                              │                              │
  │                              │ 2. Bandingkan password       │
  │                              │    bcrypt.compare(           │
  │                              │      "budi123",              │
  │                              │      "$2a$10$Xk9j..."        │
  │                              │    ) → true ✅               │
  │                              │                              │
  │                              │ 3. Buat token JWT            │
  │                              │    jwt.sign({ id: user._id })│
  │                              │                              │
  │  { access_token: "eyJh..." } │                              │
  │ ◄─────────────────────────── │                              │
```

**Langkah-langkah:**

1. Client mengirim `username` dan `password`
2. Server cari user berdasarkan `username`
3. Server bandingkan password yang dikirim dengan hash di database menggunakan `bcrypt.compare()`
4. Jika cocok → buat **token JWT** berisi `{ id: user._id }`
5. Token dikirim ke client

### 5.3 Apa itu JWT (JSON Web Token)?

JWT adalah **"kartu identitas digital"** yang diberikan setelah login berhasil.

**Analogi:**

> Bayangkan JWT seperti **gelang VIP** di sebuah konser:
>
> 1. Kamu beli tiket (**login**) → dapat gelang VIP (**token**)
> 2. Setiap mau masuk area VIP (**akses API**) → tunjukkan gelang
> 3. Petugas (**middleware**) periksa gelang → kalau asli, boleh masuk

**Struktur JWT:**

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY1YTFiMmMzIn0.abc123signature
│                      │                          │
│   HEADER             │   PAYLOAD                │   SIGNATURE
│   (info algoritma)   │   (data: id user)        │   (tanda tangan digital)
```

- **Header** — informasi tentang algoritma yang dipakai
- **Payload** — data yang disimpan (dalam projek ini: `{ id: user._id }`)
- **Signature** — tanda tangan digital agar token tidak bisa dipalsukan

### 5.4 Authentication Middleware

File: `middlewares/authentication.js`

Middleware ini berjalan **sebelum** controller transaksi — tugasnya memverifikasi apakah user sudah login.

```javascript
// LANGKAH 1: Ambil header Authorization dari request
const { authorization } = req.headers;

// LANGKAH 2: Kalau tidak ada → tolak
if (!authorization) throw { name: 'Unauthorized' };

// LANGKAH 3: Ambil bagian token dari format "Bearer <token>"
const token = authorization.split(' ')[1];

// LANGKAH 4: Verifikasi apakah token valid
const payload = jwt.verify(token, process.env.JWT_SECRET);

// LANGKAH 5: Cari user berdasarkan ID yang ada di dalam token
const user = await User.findById(payload.id);
if (!user) throw { name: 'Unauthorized' };

// LANGKAH 6: Simpan data user ke req.user → bisa dipakai di controller
req.user = user;

// LANGKAH 7: Lanjut ke controller
next();
```

**Poin penting:**

- Format header: `Authorization: Bearer <token>`
- Middleware ini **hanya** berjalan untuk route `/transactions`, **bukan** `/register` dan `/login`
- Setelah diverifikasi, `req.user` berisi data user → controller tahu **siapa** yang sedang mengakses

---

## 6. Penjelasan Setiap File

### 6.1 `index.js` — Entry Point (Titik Awal)

Ini adalah file yang pertama dijalankan saat server dinyalakan.

| Kode | Fungsi |
|------|--------|
| `require('dotenv').config()` | Baca file `.env` supaya variabel environment bisa dipakai |
| `const app = express()` | Buat instance aplikasi Express |
| `app.use(express.json())` | Middleware agar Express bisa membaca body JSON dari request |
| `app.use('/api', router)` | Semua route diawali prefix `/api` |
| `app.use(errorHandler)` | Error handler global — menangkap semua error |
| `mongoose.connect(...)` | Hubungkan ke MongoDB, lalu jalankan server |

### 6.2 `routes/index.js` — Router Utama

Menggabungkan semua route dan mengatur **urutan middleware**.

```javascript
router.use(authRoutes);            // 1. Route register & login (TANPA auth)
router.use(authentication);        // 2. Middleware auth (cek token)
router.use('/transactions', ...);  // 3. Route transaksi (BUTUH auth)
```

> ⚠️ **Urutan sangat penting!** Route auth (`/register`, `/login`) harus **sebelum** middleware authentication. Kalau dibalik, user tidak bisa register/login karena belum punya token.

### 6.3 `routes/auth.js` — Route Autentikasi

```javascript
router.post('/register', AuthController.register);  // Daftar akun baru
router.post('/login', AuthController.login);         // Login
```

Dua endpoint ini **tidak memerlukan token** karena user belum login.

### 6.4 `routes/transactions.js` — Route Transaksi

```javascript
router.get('/', TransactionsController.getAllTransactions);       // GET semua
router.get('/summary', TransactionsController.getSummary);       // GET saldo
router.get('/:id', TransactionsController.getTransactionById);   // GET satu
router.post('/', TransactionsController.createTransaction);      // CREATE
router.put('/:id', TransactionsController.updateTransaction);    // UPDATE
router.delete('/:id', TransactionsController.deleteTransaction); // DELETE
```

Semua endpoint ini **memerlukan token** karena sudah melewati middleware authentication.

### 6.5 `controllers/authController.js` — Logika Register & Login

| Method | Alur |
|--------|------|
| `register` | Terima `username` + `password` → hash password → simpan ke MongoDB |
| `login` | Terima `username` + `password` → cari user → bandingkan password → buat token JWT |

### 6.6 `controllers/transactionsController.js` — Logika CRUD

| Method | Fungsi | Mongoose Method yang Dipakai |
|--------|--------|------------------------------|
| `getAllTransactions` | Ambil semua transaksi milik user yang login | `Transaction.find({ userId })` |
| `getTransactionById` | Ambil satu transaksi berdasarkan ID | `Transaction.findOne({ _id, userId })` |
| `createTransaction` | Buat transaksi baru | `Transaction.create({...})` |
| `updateTransaction` | Update data transaksi | `Transaction.findOneAndUpdate(...)` |
| `deleteTransaction` | Hapus transaksi | `Transaction.findOneAndDelete(...)` |
| `getSummary` | Hitung total saldo | `Transaction.find()` + kalkulasi |

**Keamanan Data:** Setiap operasi selalu pakai filter `userId: req.user._id`, jadi user **hanya bisa akses transaksi miliknya sendiri**.

**Cara kerja `getSummary`:**

```javascript
let total = 0;
transactions.forEach(trx => {
    if (trx.type === 'income') total += trx.amount;   // Pemasukan: tambah
    if (trx.type === 'expense') total -= trx.amount;   // Pengeluaran: kurang
});
// Hasilnya: total saldo bersih
```

### 6.7 `middlewares/errorHandler.js` — Penanganan Error

Middleware ini menangkap **semua error** dari controller dan mengembalikan response yang konsisten.

| Jenis Error | Status Code | Pesan Error |
|-------------|-------------|-------------|
| `ValidationError` (Mongoose) | 400 | Pesan validasi, misal: "Title is required" |
| `CastError` (ID tidak valid) | 400 | "ID format is invalid: ..." |
| `InvalidLogin` | 401 | "Invalid username or password" |
| `Unauthorized` / `JsonWebTokenError` | 401 | "You are unauthorized. Please login first!" |
| Duplicate Key (`code: 11000`) | 400 | "Username is already taken" |
| Error lainnya | 500 | "Internal Server Error" |

**Kenapa error handling terpusat?**

- Semua controller cukup pakai `next(error)` untuk melempar error
- Tidak perlu menulis response error berulang di setiap controller
- Format response error selalu konsisten: `{ success: false, error: "..." }`

### 6.8 `middlewares/authentication.js` — Verifikasi Token

Sudah dijelaskan di [bagian 5.4](#54-authentication-middleware).

### 6.9 `helpers/createError.js` — Custom Error

```javascript
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
```

Fungsi sederhana untuk membuat Error dengan `statusCode` custom. Dipakai di controller, contoh:

```javascript
throw createError('Transaction not found', 404);
```

Lalu `errorHandler` akan membaca `error.statusCode` dan mengirim response dengan status yang sesuai.

### 6.10 `.env` — Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/money-tracker
JWT_SECRET=kunci_rahasia_jwt_kamu
```

| Variable | Fungsi |
|----------|--------|
| `PORT` | Nomor port tempat server berjalan |
| `MONGO_URI` | Alamat koneksi ke MongoDB (bisa lokal atau cloud Atlas) |
| `JWT_SECRET` | Kunci rahasia untuk membuat dan memverifikasi token JWT |

> ⚠️ File `.env` **tidak boleh di-push** ke GitHub (sudah diatur di `.gitignore`). Ini file rahasia yang berisi credential.

---

## 7. Daftar Endpoint API

### 🔓 Public — Tanpa Token

| Method | Endpoint | Body | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/api/register` | `{ "username": "...", "password": "..." }` | Daftar akun baru |
| `POST` | `/api/login` | `{ "username": "...", "password": "..." }` | Login, dapat token |

### 🔒 Protected — Wajib Token

**Header wajib:** `Authorization: Bearer <access_token>`

| Method | Endpoint | Body | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/transactions` | — | Ambil semua transaksi user |
| `GET` | `/api/transactions/summary` | — | Lihat total saldo |
| `GET` | `/api/transactions/:id` | — | Ambil satu transaksi |
| `POST` | `/api/transactions` | `{ "title", "amount", "type" }` | Buat transaksi baru |
| `PUT` | `/api/transactions/:id` | `{ "title", "amount", "type" }` (opsional) | Update transaksi |
| `DELETE` | `/api/transactions/:id` | — | Hapus transaksi |

---

## 8. Contoh Penggunaan dengan Postman

### Step 1 — Register (Daftar Akun)

```
POST http://localhost:3000/api/register
Content-Type: application/json

Body:
{
    "username": "budi",
    "password": "budi123"
}
```

**Response (201):**

```json
{
    "message": "User registered",
    "user": {
        "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "username": "budi",
        "password": "$2a$10$hashedpassword...",
        "createdAt": "2026-02-26T03:00:00.000Z",
        "updatedAt": "2026-02-26T03:00:00.000Z"
    }
}
```

### Step 2 — Login (Dapat Token)

```
POST http://localhost:3000/api/login
Content-Type: application/json

Body:
{
    "username": "budi",
    "password": "budi123"
}
```

**Response (200):**

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 📋 **Copy token ini!** Kamu butuh ini untuk langkah selanjutnya.

### Step 3 — Buat Transaksi

```
POST http://localhost:3000/api/transactions
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Body:
{
    "title": "Gaji Bulanan",
    "amount": 5000000,
    "type": "income"
}
```

**Response (201):**

```json
{
    "success": true,
    "data": {
        "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
        "title": "Gaji Bulanan",
        "amount": 5000000,
        "type": "income",
        "userId": "65f1a2b3c4d5e6f7a8b9c0d1",
        "createdAt": "2026-02-26T03:10:00.000Z",
        "updatedAt": "2026-02-26T03:10:00.000Z"
    }
}
```

### Step 4 — Buat Transaksi Pengeluaran

```
POST http://localhost:3000/api/transactions
Authorization: Bearer <token>

Body:
{
    "title": "Beli Kopi",
    "amount": 25000,
    "type": "expense"
}
```

### Step 5 — Lihat Semua Transaksi

```
GET http://localhost:3000/api/transactions
Authorization: Bearer <token>
```

**Response (200):**

```json
{
    "userId": "65f1a2b3c4d5e6f7a8b9c0d1",
    "success": true,
    "data": [
        {
            "_id": "...",
            "title": "Gaji Bulanan",
            "amount": 5000000,
            "type": "income"
        },
        {
            "_id": "...",
            "title": "Beli Kopi",
            "amount": 25000,
            "type": "expense"
        }
    ]
}
```

### Step 6 — Lihat Summary (Saldo)

```
GET http://localhost:3000/api/transactions/summary
Authorization: Bearer <token>
```

**Response (200):**

```json
{
    "total_balance": 4975000
}
```

> Penjelasan: Gaji 5.000.000 (income) − Kopi 25.000 (expense) = **4.975.000**

### Step 7 — Update Transaksi

```
PUT http://localhost:3000/api/transactions/65f1a2b3c4d5e6f7a8b9c0d2
Authorization: Bearer <token>

Body:
{
    "title": "Gaji Bulanan (Revisi)",
    "amount": 5500000
}
```

### Step 8 — Hapus Transaksi

```
DELETE http://localhost:3000/api/transactions/65f1a2b3c4d5e6f7a8b9c0d2
Authorization: Bearer <token>
```

**Response (200):**

```json
{
    "success": true,
    "data": {}
}
```

---

## Ringkasan Arsitektur Keseluruhan

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Postman)                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────────────┐
│               EXPRESS SERVER (index.js)                   │
│                                                           │
│  express.json() → Parse body JSON                         │
│                                                           │
│  ┌─────────────────────────────────────────────┐          │
│  │            ROUTES (routes/)                  │         │
│  │                                              │         │
│  │  /register, /login → authController          │         │
│  │  ──── authentication middleware ────         │         │
│  │  /transactions → transactionsController      │         │
│  └──────────────────┬──────────────────────────┘          │
│                     │                                     │
│  ┌──────────────────▼──────────────────────────┐          │
│  │         CONTROLLERS (controllers/)           │         │
│  │  Logika bisnis + interaksi database          │         │
│  └──────────────────┬──────────────────────────┘          │
│                     │                                     │
│  ┌──────────────────▼──────────────────────────┐          │
│  │        MONGOOSE MODELS (models/)             │         │
│  │  Schema User + Schema Transaction            │         │
│  └──────────────────┬──────────────────────────┘          │
│                     │                                     │
│  ┌──────────────────▼──────────────────────────┐          │
│  │          ERROR HANDLER (middlewares/)         │        │
│  │  Tangkap & format semua error                │         │
│  └─────────────────────────────────────────────┘          │
└──────────────────────┬────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                 MONGODB (Database)                      │
│                                                         │
│  Collection: users          Collection: transactions    │
│  ┌──────────────────┐      ┌──────────────────────┐     │
│  │ _id              │      │ _id                  │     │
│  │ username         │      │ title                │     │
│  │ password (hash)  │◄─────│ userId (ref: User)   │     │
│  │ createdAt        │      │ amount               │     │
│  │ updatedAt        │      │ type                 │     │
│  └──────────────────┘      │ createdAt            │     │
│                            │ updatedAt            │     │
│                            └──────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

> 📌 **Dokumentasi ini** dibuat untuk memudahkan pemahaman alur kerja projek CRUD Backend Money Tracker secara menyeluruh. Mulai dari bagaimana request datang, diproses, hingga response dikirim kembali ke client.
