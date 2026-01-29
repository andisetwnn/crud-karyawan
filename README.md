Technical Test Programmer 

Aplikasi Management Karyawan (CRUD) modern yang dibangun menggunakan Express.js (Backend) dan Vue.js 3 + Tailwind CSS (Frontend).

![WhatsApp Image 2026-01-29 at 11 12 19 AM](https://github.com/user-attachments/assets/ba8e3e66-12a7-49eb-ae4f-62cbe9283788)

🛠️ Tech Stack
Frontend: Vue.js 3 (Vite), Tailwind CSS, DaisyUI, Axios.
Backend: Node.js, Express.js, Sequelize ORM.
Database: MySQL.

🚀 Cara Menjalankan Aplikasi
Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di mesin lokal Anda.

1. Persiapan Database
Pastikan layanan MySQL Anda aktif (XAMPP/Laragon/Native).

Buat database baru bernama db_karyawan.

Buat file .env di root project (sejajar dengan folder models) dan isi kredensial berikut:

Cuplikan kode
DB_NAME=db_karyawan
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
PORT=3000
(Kosongkan password jika menggunakan setelan default XAMPP).

2. Setup Backend
Buka terminal di direktori utama project:

npm install
npm run dev

3. Setup Frontend
Buka terminal baru dan masuk ke folder frontend:

cd frontend
npm install
npm run dev
Aplikasi dapat diakses melalui browser di http://localhost:5173.
