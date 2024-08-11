import { pool } from "../../db/connection.js";

const query = `
    INSERT INTO users (full_name, email, password_hash, phone_number, role) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
`;

async function createUser(req, res) {
  try {
    const { fullname, email, password_hash, phoneNumber, role } = req.body;

    const dbRes = await pool.query(query, [
      fullname,
      email,
      password_hash,
      phoneNumber,
      role,
    ]);

    console.log(dbRes.rows[0]); // Logs the created user details
    res.status(200).json({ message: "User created", user: dbRes.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
}

export { createUser };
