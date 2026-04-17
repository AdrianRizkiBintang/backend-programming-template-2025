# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

# 🎰 Gacha System API - Quiz Backend Programming

Repository ini berisi implementasi sistem undian (Gacha) sederhana yang dibangun menggunakan **Node.js**, **Express**, dan **MongoDB**. Sistem ini menggunakan arsitektur **Layered Pattern** (Route -> Controller -> Service -> Repository) untuk memisahkan logika bisnis dan mempermudah _maintenance_.

## 🚀 Penjelasan Sistem & Fitur Utama

Sistem ini dirancang untuk menangani simulasi gacha dengan ketentuan sebagai berikut:

1. **Limitasi User**: Setiap user (berdasarkan `userId`) hanya dapat melakukan gacha maksimal **5 kali dalam sehari**. Logika ini divalidasi di level _Service_.
2. **Manajemen Kuota Hadiah**: Terdapat 5 jenis hadiah dengan kuota terbatas. Sistem akan mengecek tabel histori untuk memastikan hadiah tidak diberikan jika kuotanya sudah habis.
3. **Sistem Probabilitas (RNG)**: Jika masih ada hadiah yang tersedia, sistem memberikan peluang kemenangan sebesar 30% menggunakan `Math.random()`. Hadiah yang dimenangkan dipilih secara acak dari sisa hadiah yang ada.
4. **Sensor Nama (Privacy)**: Nama user yang memenangkan hadiah disensor secara acak (contoh: `A**i*n`) saat ditampilkan di daftar pemenang.
5. **Database Logging**: Setiap percobaan gacha (baik menang maupun kalah) selalu dicatat ke dalam database MongoDB (`GachaHistories`).

---

## 🛣️ Dokumentasi API (Endpoints)

Semua endpoint di bawah ini menggunakan Base URL: `http://localhost:5000/api/gacha`

### 1. Eksekusi Gacha

Endpoint utama untuk user melakukan undian. Sistem akan memvalidasi limit harian dan ketersediaan kuota hadiah.

- **Endpoint**: `/play`
- **Method**: `POST`
- **Request Body (JSON)**:
  ```json
  {
    "userId": "535250060",
    "userName": "Adrian"
  }
  ```

Output Berhasil (Menang):

{
"message": "Selamat! Anda memenangkan Smartphone X"
}

Output Berhasil (Kalah):

{
"message": "Maaf, Anda belum beruntung. Coba lagi besok!"
}

Output Error (Limit Gacha Habis):

{
"statusCode": 422,
"error": "UNPROCESSABLE_ENTITY",
"message": "Gagal: Limit gacha harian tercapai (maks 5 kali/hari)."
}

2. Cek Sisa Kuota Hadiah
   Menampilkan daftar seluruh hadiah beserta sisa kuota yang belum dimenangkan oleh user.

Endpoint: /prizes

Method: GET

Request Body: Tidak Ada

Output:

[
{ "hadiah": "Emas 10 gram", "kuotaTersisa": 1 },
{ "hadiah": "Smartphone X", "kuotaTersisa": 4 },
{ "hadiah": "Smartwatch Y", "kuotaTersisa": 10 },
{ "hadiah": "Voucher Rp100.000", "kuotaTersisa": 100 },
{ "hadiah": "Pulsa Rp50.000", "kuotaTersisa": 498 }
]

3. Daftar Pemenang
   Menampilkan daftar user yang telah berhasil memenangkan hadiah. Nama user dikelompokkan berdasarkan hadiah dan disamarkan secara acak demi menjaga privasi.

Endpoint: /winners

Method: GET

Request Body: Tidak Ada

Output:

{
"Smartphone X": ["A**i*n", "J*** *oe"],
"Pulsa Rp50.000": ["*ud*"]
}

4. Histori Gacha User
   Menampilkan riwayat gacha lengkap milik satu user tertentu, baik riwayat menang maupun kalah. Data diurutkan dari yang terbaru.

Endpoint: /history/:userId

Method: GET

Parameter: userId diletakkan langsung di dalam URL.

Output:

[
{
"_id": "64b8a...",
"userId": "535250060",
"userName": "Adrian",
"isWin": true,
"prizeName": "Smartphone X",
"date": "2026-04-16T10:00:00.000Z"
},
{
"_id": "64b8b...",
"userId": "535250060",
"userName": "Adrian",
"isWin": false,
"prizeName": null,
"date": "2026-04-16T09:55:00.000Z"
}
]
