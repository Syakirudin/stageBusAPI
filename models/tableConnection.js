import { pool } from "../db/connection.js";

// Function to create the Users table
async function createUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create the Buses table
async function createBusesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS buses (
      id SERIAL PRIMARY KEY,
      bus_number VARCHAR(20) UNIQUE NOT NULL,
      total_seats INT NOT NULL,
      bus_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create the Routes table
async function createBusRouteTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS routes (
      id SERIAL PRIMARY KEY,
      route_name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create the Stops table
async function createBusStopTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stops (
    id SERIAL PRIMARY KEY,
    route_id INT REFERENCES routes(id) ON DELETE CASCADE,
    city_name VARCHAR(100) NOT NULL,
    stop_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    coordinate VARCHAR(255),
    stop_name VARCHAR(100) NOT NULL,
    stop_type VARCHAR(50) NOT NULL, 
    UNIQUE(route_id, stop_order)
);
  `);
}

// Function to create the Trips table
async function createBusTripTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trips (
      id SERIAL PRIMARY KEY,
      bus_id INT REFERENCES buses(id) ON DELETE CASCADE,
      route_id INT REFERENCES routes(id) ON DELETE CASCADE,
      departure_date DATE NOT NULL,
      departure_time TIME NOT NULL,
      arrival_time TIME NOT NULL,
      base_price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create the DropOffStops table
async function createBusDropOffStopTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drop_off_stops (
      id SERIAL PRIMARY KEY,
      coordinate VARCHAR(255) NOT NULL,
      time TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create the BoardingStops table
async function createBusBoardingStopTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS boarding_stops (
      id SERIAL PRIMARY KEY,
      coordinate VARCHAR(255) NOT NULL,
      time TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create the TripPricing table
async function createBusFareTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trip_pricing (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    boarding_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    dropoff_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, boarding_stop_id, dropoff_stop_id)
);
  `);
}

// Function to create the Payments table
async function createBusPaymentTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    boarding_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    dropoff_stop_id INT REFERENCES stops(id) ON DELETE CASCADE,
    seat_number INT NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `);
}

// Function to create the AdminLogs table
async function createAdminLogTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id SERIAL PRIMARY KEY,
      admin_id INT REFERENCES users(id) ON DELETE CASCADE,
      action VARCHAR(255) NOT NULL,
      target_table VARCHAR(100),
      target_id INT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Function to create all tables
async function createAllTables() {
  try {
    await pool.connect();

    await createUsersTable();
    await createBusesTable();
    await createBusRouteTable();
    await createBusStopTable();
    await createBusTripTable();
    await createBusDropOffStopTable();
    await createBusBoardingStopTable();
    await createBusFareTable();
    await createBusPaymentTable();
    await createAdminLogTable();

    console.log("All tables created successfully");
  } catch (error) {
    console.error(error);
  }
}

export { createAllTables };
