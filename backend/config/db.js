
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

// Database configuration
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const databaseName = process.env.DB_NAME;

if (!databaseName) {
    throw new Error("DB_NAME is missing in .env");
}

// First create a connection without selecting a database
const connection = await mysql.createConnection(config);

// Create database automatically
await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${databaseName.replaceAll("`", "``")}\``
);

console.log("Database created or already exists");

await connection.end();

// Create connection pool for the selected database
const db = mysql.createPool({
    ...config,
    database: databaseName,
    multipleStatements: true
});

// Read schema.sql
const schemaPath = fileURLToPath(
    new URL("../schema.sql", import.meta.url)
);

const schema = fs.readFileSync(schemaPath, "utf8");

// Execute all table creation queries
await db.query(schema);

console.log("All database tables created successfully");

export default db;
