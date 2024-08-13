import { pool } from "../db/connection.js";

//This is where all the queries are created
//user,bus,bus_route,bus_stop,bus_trip,bus_fare,bus_reserve,bus_payment,bus_adminlog

async function createUsersTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(50) DEFAULT 'user',  -- 'user' or 'admin'
    area VARCHAR(100),
    district VARCHAR(100),
    level VARCHAR(50),
    coordinate VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
  );
}

// async function alterUsersTable() {
//   await pool.query(`
//         ALTER TABLE users
//         ADD COLUMN area VARCHAR(100),
//         ADD COLUMN district VARCHAR(100),
//         ADD COLUMN level VARCHAR(50),
//         ADD COLUMN coordinate VARCHAR(255);
//     `);
// }

async function createBusesTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    total_seats INT NOT NULL,
    bus_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
  );
}

async function createBusRouteTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    route_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
  );
}

async function createBusStopTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS stops (
    id SERIAL PRIMARY KEY,
    route_id INT REFERENCES routes(id) ON DELETE CASCADE,
    city_name VARCHAR(100) NOT NULL,
    stop_order INT NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    stop_type VARCHAR(50) NOT NULL,
    coordinate VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, stop_order));`
  );
}

// async function alterBusStopTable() {
//   await pool.query(`
//         ALTER TABLE stops
//         ADD COLUMN stop_name VARCHAR(100) NOT NULL,
//         ADD COLUMN stop_type VARCHAR(50) NOT NULL,
//         ADD COLUMN coordinate VARCHAR(255);
//     `);
// }

async function createBusTripTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    bus_id INT REFERENCES buses(id) ON DELETE CASCADE,
    route_id INT REFERENCES routes(id) ON DELETE CASCADE,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
  );
}

async function createBusFareTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS trip_pricing (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    boarding_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    dropoff_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, boarding_stop_id, dropoff_stop_id));`
  );
}

async function createBusReserveTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    boarding_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    dropoff_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    seat_number INT NOT NULL,
    reservation_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, seat_number));`
  );
}

async function createBusPaymentTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
  );
}

async function createAdminLogTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    target_table VARCHAR(100),
    target_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP); `
  );
}

async function createAllTables() {
  try {
    // await pool.query(query);
    await pool.connect();

    await createUsersTable();
    await createBusesTable();
    await createBusStopTable();
    await createBusRouteTable();
    await createBusTripTable();
    await createBusFareTable();
    await createBusReserveTable();
    await createBusPaymentTable();
    await createAdminLogTable();

    // await alterUsersTable();
    // await alterBusStopTable();

    console.log(`All tables created and altered successfully`);
  } catch (error) {
    console.error(error);
  }
}

export { createAllTables};

// export { createAllTables, alterUsersTable, alterBusStopTable };
