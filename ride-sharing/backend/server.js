const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = 5000;
const amritaEmailEnding = "@am.students.amrita.edu";

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working" });
});

app.post("/signup", async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password;

    if (!email.endsWith(amritaEmailEnding)) {
        return res.status(400).json({ message: "Please use your Amrita ID" });
    }

    if (typeof password !== "string" || password.length === 0) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, password]
        );
        return res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "Email already exists" });
        }
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body.password;

    if (!email.endsWith(amritaEmailEnding)) {
        return res.status(400).json({ message: "Please use your Amrita ID" });
    }

    try {
        const result = await pool.query(
            "SELECT id, email FROM users WHERE email = $1 AND password = $2",
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.json({ id: result.rows[0].id, email: result.rows[0].email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

app.post("/requests", async (req, res) => {
    const { user_id, location, date, members, train, time } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO requests (user_id, location, date, members, train, time, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending')
             RETURNING *`,
            [user_id, location, date, members, train, time]
        );
        return res.status(201).json({ message: "Request created successfully", request: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Could not create request" });
    }
});

app.get("/requests", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM requests WHERE status <> 'cancelled' ORDER BY id DESC"
        );
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not get requests" });
    }
});

app.get("/requests/user/:userId", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM requests WHERE user_id = $1 AND status <> 'cancelled' ORDER BY id DESC",
            [req.params.userId]
        );
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not get user requests" });
    }
});

app.post("/requests/:id/accept", async (req, res) => {
    const acceptingUserId = req.body.user_id;

    try {
        const requestResult = await pool.query(
            "SELECT * FROM requests WHERE id = $1",
            [req.params.id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        const rideRequest = requestResult.rows[0];
        if (rideRequest.status !== "pending") {
            return res.status(400).json({ message: "Request is no longer pending" });
        }

        if (Number(rideRequest.user_id) === Number(acceptingUserId)) {
            return res.status(400).json({ message: "You cannot accept your own request" });
        }

        const updateResult = await pool.query(
            `UPDATE requests SET accepted_by = $1, status = 'accepted'
             WHERE id = $2 AND status = 'pending' RETURNING *`,
            [acceptingUserId, req.params.id]
        );

        if (updateResult.rows.length === 0) {
            return res.status(400).json({ message: "Request is no longer pending" });
        }

        await pool.query(
            "INSERT INTO notifications (user_id, message) VALUES ($1, $2)",
            [rideRequest.user_id, "Your ride request has been accepted."]
        );

        return res.json({ message: "Request accepted successfully", request: updateResult.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Could not accept request" });
    }
});

app.delete("/requests/:id", async (req, res) => {
    const userId = req.body.user_id;

    try {
        const requestResult = await pool.query(
            "SELECT user_id, status FROM requests WHERE id = $1",
            [req.params.id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (Number(requestResult.rows[0].user_id) !== Number(userId)) {
            return res.status(403).json({ message: "You can only cancel your own request" });
        }

        if (requestResult.rows[0].status === "cancelled") {
            return res.status(400).json({ message: "Request is already cancelled" });
        }

        await pool.query(
            "UPDATE requests SET status = 'cancelled' WHERE id = $1",
            [req.params.id]
        );
        return res.json({ message: "Request cancelled successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not cancel request" });
    }
});

app.get("/notifications/:userId", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
            [req.params.userId]
        );
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not get notifications" });
    }
});

app.post("/notifications/:id/read", async (req, res) => {
    try {
        const result = await pool.query(
            "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING id",
            [req.params.id, req.body.user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.json({ message: "Notification marked as read" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not update notification" });
    }
});

async function startServer() {
    try {
        await pool.query("SELECT 1");
        console.log("Database connected");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS requests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                location TEXT NOT NULL,
                date DATE NOT NULL,
                members INTEGER NOT NULL,
                train TEXT NOT NULL,
                time TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                accepted_by INTEGER REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN NOT NULL DEFAULT FALSE
            );
        `);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();