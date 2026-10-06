const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = 5000;
const amritaEmailEnding = "@am.students.amrita.edu";
const requestSelect = `
    select r.*,
        coalesce((
            select json_agg(json_build_object('id', u.id, 'email', u.email) order by rm.id)
            from request_members rm
            join users u on u.id = rm.user_id
            where rm.request_id = r.id
        ), '[]'::json) as joined_members
    from requests r`;

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
            "insert into users (email, password) values ($1, $2) returning id, email",
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
            "select id, email from users where email = $1 and password = $2",
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
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const result = await client.query(
            `insert into requests (user_id, location, date, members, train, time, status)
             values ($1, $2, $3, $4, $5, $6, case when $4 <= 1 then 'accepted' else 'pending' end)
             returning *`,
            [user_id, location, date, members, train, time]
        );
        await client.query(
            "insert into request_members (request_id, user_id) values ($1, $2)",
            [result.rows[0].id, user_id]
        );
        await client.query("COMMIT");
        return res.status(201).json({ message: "Request created successfully", request: result.rows[0] });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return res.status(400).json({ message: "Could not create request" });
    } finally {
        client.release();
    }
});

app.get("/requests", async (req, res) => {
    try {
        const result = await pool.query(
            `${requestSelect} where r.status <> 'cancelled' order by r.id desc`
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
            `${requestSelect} where r.user_id = $1 and r.status <> 'cancelled' order by r.id desc`,
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
    const client = await pool.connect();
    let transactionStarted = false;

    try {
        await client.query("BEGIN");
        transactionStarted = true;

        const requestResult = await client.query(
            "select * from requests where id = $1 for update",
            [req.params.id]
        );

        if (requestResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Request not found" });
        }

        const rideRequest = requestResult.rows[0];
        if (rideRequest.status === "cancelled") {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Request is no longer available" });
        }

        if (Number(rideRequest.user_id) === Number(acceptingUserId)) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "You cannot accept your own request" });
        }

        const memberCountResult = await client.query(
            "select count(*)::int as count from request_members where request_id = $1",
            [req.params.id]
        );
        const memberCount = memberCountResult.rows[0].count;

        if (memberCount >= Number(rideRequest.members)) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "Request is full" });
        }

        const existingMember = await client.query(
            "select 1 from request_members where request_id = $1 and user_id = $2",
            [req.params.id, acceptingUserId]
        );
        if (existingMember.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "You have already joined this request" });
        }

        const acceptingUser = await client.query(
            "select email from users where id = $1",
            [acceptingUserId]
        );
        if (acceptingUser.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({ message: "User not found" });
        }

        await client.query(
            "insert into request_members (request_id, user_id) values ($1, $2)",
            [req.params.id, acceptingUserId]
        );
        const updatedResult = await client.query(
            `update requests set status = case
                when (select count(*) from request_members where request_id = $1) >= members then 'accepted'
                else'pending'
             end
             where id = $1 returning *`,
            [req.params.id]
        );
        const updatedRequest = await client.query(
            `${requestSelect} where r.id = $1`,
            [req.params.id]
        );
        await client.query(
            "insert into notifications (user_id, message) values ($1, $2)",
            [rideRequest.user_id, `Student with Amrita ID ${acceptingUser.rows[0].email} joined your request #${rideRequest.id}.`]
        );
        await client.query("COMMIT");
        const request = { ...updatedResult.rows[0], joined_members: updatedRequest.rows[0].joined_members };

        return res.json({ message: "Request accepted successfully", request });
    } catch (error) {
        if (transactionStarted) await client.query("ROLLBACK");
        console.error(error);
        return res.status(400).json({ message: "Could not accept request" });
    } finally {
        client.release();
    }
});

app.get("/requests/:id/members", async (req, res) => {
    try {
        const result = await pool.query(
            `select u.id, u.email
             from request_members rm
             join users u on u.id = rm.user_id
             where rm.request_id = $1
             order by rm.id`,
            [req.params.id]
        );
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Could not get request members" });
    }
});

app.delete("/requests/:id", async (req, res) => {
    const userId = req.body.user_id;

    try {
        const requestResult = await pool.query(
            "select user_id, status from requests where id = $1",
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
            "update requests set status = 'cancelled' where id = $1",
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
            "select id, user_id, message from notifications where user_id = $1 order by id desc",
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
            "update notifications set is_read = true where id = $1 and user_id = $2 returning id",
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
        await pool.query("select 1");
        console.log("Database connected");

        await pool.query(`
            create table if not exists users (
                id serial primary key,
                email text not null unique,
                password text not null
            );

            create table if not exists requests (
                id serial primary key,
                user_id integer not NULL REFERENCES users(id),
                location text not null,
                date date not null,
                members integer not null,
                train text not null,
                time text not null,
                status text not null DEFAULT 'pending',
                accepted_by integer references users(id)
            );

            create table if not exists notifications (
                id serial primary key,
                user_id integer not null references users(id),
                message text not null,
                created_at timestamp not null DEFAULT CURRENT_TIMESTAMP,
                is_read boolean not null DEFAULT FALSE
            );

            create table if not exists request_members (
                id serial primary key,
                request_id integer not null references requests(id),
                user_id integer not null references users(id),
                unique (request_id, user_id)
            );

            insert into request_members (request_id, user_id)
            select id, user_id from requests
            on conflict (request_id, user_id) do nothing;

            insert into request_members (request_id, user_id)
            select id, accepted_by from requests where accepted_by is not null
            on conflict (request_id, user_id) do nothing;

            update requests r
            set status = case
                when (select count(*) from request_members rm where rm.request_id = r.id) >= r.members then 'accepted'
                ELSE 'pending'
            end
            where r.status <> 'cancelled';
        `);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();