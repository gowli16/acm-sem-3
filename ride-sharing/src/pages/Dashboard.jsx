import { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { apiUrl } from "../api";

function formatDate(date) {
    const [year, month, day] = String(date).slice(0, 10).split("-").map(Number);
    if (!year || !month || !day) return date;
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function normalizeSearchValue(value) {
    return String(value).toLowerCase().replace("karunagappalli", "karunagapally");
}

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

    const normalizedSearch = normalizeSearchValue(searchTerm.trim());
    const matchingRequests = requests.filter((request) =>
        [request.location, request.date, request.train, request.id]
            .some((value) => normalizeSearchValue(value).includes(normalizedSearch))
    );

    function renderRequest(request, showAcceptButton = false) {
        const joinedMembers = request.joined_members || [];
        const isMember = joinedMembers.some((member) => Number(member.id) === Number(userId));
        const isCreator = Number(request.user_id) === Number(userId);
        const isCancelled = request.status === "cancelled";
        const isFull = !isCancelled && joinedMembers.length >= Number(request.members);

        return (
            <article className="requestcard dashboardRequestCard" key={request.id}>
                <header className="requestCardHeader">
                    <h2>Request #{request.id}</h2>
                </header>
                <div className="rideInfo">
                    <p className="rideInfoItem">
                        <strong>Location</strong>
                        <span>{request.location}</span>
                    </p>
                    <p className="rideInfoItem">
                        <strong>Date</strong>
                        <span>{formatDate(request.date)}</span>
                    </p>
                    <p className="rideInfoItem">
                        <strong>Train</strong>
                        <span>{request.train}</span>
                    </p>
                    <p className="rideInfoItem">
                        <strong>Time</strong>
                        <span>{request.time}</span>
                    </p>
                    <p className="rideInfoItem">
                        <strong>Members</strong>
                        <span>{request.members}</span>
                    </p>
                    <p className="rideInfoItem">
                        <strong>Status</strong>
                        <span className="requestStatus">
                            {isCancelled
                                ? "Cancelled"
                                : isFull
                                    ? `Full (${joinedMembers.length}/${request.members} members joined)`
                                    : `${joinedMembers.length}/${request.members} members joined`}
                        </span>
                    </p>
                </div>
                <section className="peopleSharing">
                    <h3>People sharing this auto</h3>
                    <div className="memberList">
                        {joinedMembers.map((member) => (
                            <p className="memberEmail" key={member.id}>{member.email}</p>
                        ))}
                    </div>
                </section>
                {showAcceptButton && !isCreator && !isMember && !isFull && !isCancelled && (
                    <button
                        className="requestAcceptButton"
                        type="button"
                        onClick={() => acceptRequest(request.id)}
                    >
                        Accept
                    </button>
                )}
            </article>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboardHeader">
                <h1 className="dashboardTitle">Dashboard</h1>
                <div className="dashboardSearch">
                    <Searchbar value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                </div>
                <section className="dashboardNotifications">
                    <h2>Notifications</h2>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <p key={notification.id}>{notification.message}</p>
                        ))
                    ) : (
                        <p>No notifications.</p>
                    )}
                </section>
            </header>
            {message && <p className="dashboardMessage" role="status">{message}</p>}
            <div className="dashboardContent">
                <main className="dashboardMain">
                    <section className="dashboardSection">
                        <h2 className="sectionTitle">Ride Requests</h2>
                        <div className="requestList">
                            {matchingRequests.map((request) => renderRequest(request, Boolean(userId)))}
                        </div>
                    </section>
                    <section className="dashboardSection">
                        <h2 className="sectionTitle">My Requests</h2>
                        <div className="requestList">
                            {myRequests.map((request) => renderRequest(request))}
                        </div>
                    </section>
                </main>
                <aside className="dashboardRules">
                    <h2>General Rules</h2>
                    <p>You must create a ride minimum of 1 day prior to the departure day</p>
                    <p>You can cancel a ride up to 24 hours before the departure time</p>
                    <p>The person who creates the ride is responsible for telling the warden about the auto</p>
                </aside>
            </div>
        </div>
    );
}

export default Dashboard;