# PowerBank Rental Backend

## Project Description

This project is the backend for a system that manages power bank rental machines. It was developed to enhance my web development skills. The system supports managing users, machines (rental stations), orders, and promo codes.

The project is built using **Node.js**, **Express**, and **MongoDB**. The application follows a RESTful architecture, ensuring scalability and support for various clients.

---

## Technology Stack

- **Node.js** - A server-side platform for implementing business logic.
- **Express** - A minimalist framework for building REST APIs.
- **MongoDB** - A NoSQL database for storing data.
- **dotenv** - For managing sensitive environment variables.
- **cors** - For handling cross-origin access policies.
- **Body-Parser** - For processing incoming JSON requests.

---

## Key Features

### 1. **Authentication and User Management**

Routes:

- `POST /api/auth/register` — Register a new user.
- `POST /api/auth/verify` — Verify a user.
- `POST /api/auth/login` — Log in a user.
- `PUT /api/auth/update/:id` — Update user information.
- `DELETE /api/auth/delete/:id` — Delete a user.
- `GET /api/auth/all` — Retrieve a list of all users.

### 2. **Machine Management**

Routes:

- `POST /api/machines/add-machine` — Add a new machine.
- `POST /api/machines/set-expectation` — Set expectations for a machine.
- `POST /api/machines/respond-to-machine` — Respond to a machine request.
- `GET /api/machines/all` — Retrieve a list of all machines.
- `GET /api/machines/status/:kod` — Get the status of a machine.
- `DELETE /api/machines/delete/:id` — Remove a machine.

### 3. **Order Management**

Routes:

- `GET /api/orders/active/:userId` — Get a user's active orders.
- `GET /api/orders/completed/:userId` — Get a user's completed orders.
- `POST /api/orders/complete/:orderId` — Complete an order.

### 4. **Promo Code Management**

Routes:

- `POST /api/promoCodes/add` — Add a new promo code.
- `GET /api/promoCodes` — Retrieve a list of all promo codes.

### 5. **Additional User Data**

Routes:

- `GET /api/users/:userId` — Retrieve user information.
- `PUT /api/users/:userId` — Edit user information.
- `POST /api/users/redeem` — Redeem a promo code for a user.

---

## Installation and Launch

### 1. Install Dependencies:

```bash
npm install
```

### 2. Configure Environment Variables:

Create a `.env` file and add:

```
MONGO_URI=your_database_address
```

### 3. Start the Server:

```bash
npm start
```

The server will run on `http://<your-IP>:4000`.

---

## Future Development

- Integrating a payment system.
- Adding activity logging.
- Expanding data analysis functionality.
- Developing a frontend for interacting with this API.

---

## Contact

Developer: **s1mba121**  
GitHub: [Frontend](https://github.com/s1mba121/Energyk-frontend), [Backend](https://github.com/s1mba121/Energyk-backend)
