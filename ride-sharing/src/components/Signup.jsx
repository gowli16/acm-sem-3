import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail.endsWith("@am.students.amrita.edu")) {
            setMessage("Please use your Amrita ID");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail, password })
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Signup failed");
            setMessage(data.message);
        } catch (error) {
            setMessage(error.message || "Could not connect to the server");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="signup">
            <form onSubmit={handleSubmit} noValidate>
                <input
                    type="email"
                    placeholder="Amrita email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <br />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
                {message && <p role="status">{message}</p>}
                <button type="button" onClick={() => navigate("/login")}>
                    click here to login!!
                </button>
            </form>
        </div>
    );
}

export default Signup;