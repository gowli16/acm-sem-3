import { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";

const apiUrl = "http://localhost:5000";

function Dashboard() {
    const userId = localStorage.getItem("userId");
    const [requests, setRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${apiUrl}/requests`)
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Could not load requests");
                setRequests(data);
            })
            .catch((error) => setMessage(error.message));

        if (!userId) return undefined;

        fetch(`${apiUrl}/requests/user/${userId}`)
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Could not load your requests");
                setMyRequests(data);
            })
            .catch((error) => setMessage(error.message));

        function loadNotifications() {
            fetch(`${apiUrl}/notifications/${userId}`)
                .then(async (response) => {
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || "Could not load notifications");
                    setNotifications(data);
                })
                .catch((error) => setMessage(error.message));
        }

        loadNotifications();
        const notificationTimer = window.setInterval(loadNotifications, 5000);
        return () => window.clearInterval(notificationTimer);
    }, [userId]);

    async function acceptRequest(requestId) {
        setMessage("");
        try {
            const response = await fetch(`${apiUrl}/requests/${requestId}/accept`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: Number(userId) })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Could not accept request");

            setRequests((currentRequests) => currentRequests.map((request) =>
                request.id === requestId ? data.request : request
            ));
            setMessage(data.message);
        } catch (error) {
            setMessage(error.message || "Could not connect to the server");
        }
    }

    const matchingRequests = requests.filter((request) =>
        [request.location, request.date, request.train, request.time, request.status]
            .some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <Searchbar value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <div className="rules">
                <h1>General Rules</h1>
                <p>You must create a ride minimum of 1 day prior to the departure day</p>
                <p>You can cancel a ride up to 24 hours before the departure time</p>
                <p>The person who creates the ride is responsible for telling the warden about the auto</p>
            </div>
            <h1>Ride Requests</h1>
            {message && <p role="status">{message}</p>}
            {matchingRequests.map((request) => (
                <div className="requestcard" key={request.id}>
                    <p><strong>Location:</strong> {request.location}</p>
                    <p><strong>Date:</strong> {String(request.date).slice(0, 10)}</p>
                    <p><strong>Members:</strong> {request.members}</p>
                    <p><strong>Train:</strong> {request.train}</p>
                    <p><strong>Time:</strong> {request.time}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                    {userId && Number(request.user_id) !== Number(userId) && request.status === "pending" && (
                        <button type="button" onClick={() => acceptRequest(request.id)}>Accept</button>
                    )}
                </div>
            ))}
            <h1>My Requests</h1>
            {myRequests.map((request) => (
                <div className="requestcard" key={request.id}>
                    <p><strong>Location:</strong> {request.location}</p>
                    <p><strong>Date:</strong> {String(request.date).slice(0, 10)}</p>
                    <p><strong>Members:</strong> {request.members}</p>
                    <p><strong>Train:</strong> {request.train}</p>
                    <p><strong>Time:</strong> {request.time}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                </div>
            ))}
            <h1>Notifications</h1>
            {notifications.map((notification) => (
                <p key={notification.id}>{notification.message}</p>
            ))}
        </div>
    );
}

export default Dashboard;