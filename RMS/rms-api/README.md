# RMS API (Express + MongoDB)

Node.js REST API for the Restaurant Management System.

## Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt (admin auth)
- Multer (food image uploads)

## Setup

1. Install [MongoDB](https://www.mongodb.com/try/download/community) and ensure it is running locally.
2. Install dependencies:

```bash
cd rms-api
npm install
```

3. Copy environment variables (already provided as `.env.example`):

```bash
copy .env.example .env
```

4. Optional: seed sample menu items:

```bash
npm run seed
```

5. Start the server:

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

## Connect React frontend

In `restaurantapp`, the API client points to `http://localhost:5000/api` by default. Override with:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOADS_URL=http://localhost:5000/uploads
```

## Main endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/admin_register.php` | Register admin |
| POST | `/api/login.php` | Admin login (returns JWT) |
| GET | `/api/food_menu.php` | List menu |
| POST | `/api/food_menu.php` | Add menu item (auth + image) |
| POST | `/api/create_order.php` | Place order |
| GET | `/api/get_orders.php` | List orders |
| GET | `/api/get_payments.php` | List payments |
| POST | `/api/create_payment.php` | Record payment |
| GET | `/api/employees` | List employees (auth) |

Legacy `.php` paths match the existing React app so you can migrate from `rms_php` without renaming every call.
