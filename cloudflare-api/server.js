require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "eduportal",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
});

app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");

        res.json({
            success: true,
            message: "EduPortal local database connected",
            database: "eduportal",
            time: result.rows[0].current_time,
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

app.get("/api/students", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM students ORDER BY id DESC"
        );

        res.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error("Students error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load students",
        });
    }
});

app.get("/api/admins", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM admins ORDER BY id DESC"
        );

        res.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error("Admins error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load admins",
        });
    }
});

app.listen(PORT, () => {
    console.log(`EduPortal API running on http://localhost:${PORT}`);
});