require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
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

// ===============================
// LOGIN API
// ADMIN + TEACHER + STUDENT
// ===============================

app.post("/api/login", async (req, res) => {
    try {
        const { role, username, password } = req.body;

        if (!role || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Role, username and password are required"
            });
        }

        const tableMap = {
            administrator: "admins",
            teacher: "teachers",
            student: "students"
        };

        const table = tableMap[role];

        if (!table) {
            return res.status(400).json({
                success: false,
                message: "Invalid login role"
            });
        }

        const result = await pool.query(
            `
            SELECT *
            FROM ${table}
            WHERE LOWER(TRIM(username)) = LOWER(TRIM($1))
            LIMIT 1
            `,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Account not found"
            });
        }

        const account = result.rows[0];

        // Check whether the account is active
if (
    ["inactive", "disabled"].includes(
        String(account.status || "Active").trim().toLowerCase()
    )
) {
    return res.status(403).json({
        success: false,
        message: "This account is inactive"
    });
}

        if (String(account.password) !== String(password)) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Password frontend ko return nahi karna
        const safeAccount = { ...account };
        delete safeAccount.password;

        res.json({
            success: true,
            message: "Login successful",
            role: role,
            data: safeAccount
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`EduPortal API running on http://localhost:${PORT}`);
});