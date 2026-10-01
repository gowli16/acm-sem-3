
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:5000";

function Cancelride() {
  const userId = localStorage.getItem("userId");
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return;

    fetch(`${apiUrl}/requests/user/${userId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load rides");
        setRides(data.filter((request) => request.status === "accepted"));
      })
      .catch((error) => setMessage(error.message));
  }, [userId]);

  async function cancelRide(rideId) {
    try {
      const response = await fetch(`${apiUrl}/requests/${rideId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not cancel ride");

      setRides((currentRides) => currentRides.filter((ride) => ride.id !== rideId));
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || "Could not connect to the server");
    }
  }

  return (
    <div className="cancelride">
      <h1>Cancel Ride</h1>
      {!userId && <p>Please log in to view your rides</p>}
      {message && <p role="status">{message}</p>}
      {userId && rides.length === 0 && !message && <p>No accepted rides to cancel.</p>}
      {rides.map((ride) => (
        <div className="requestcard" key={ride.id}>
          <p><strong>Location:</strong> {ride.location}</p>
          <p><strong>Date:</strong> {String(ride.date).slice(0, 10)}</p>
          <p><strong>Status:</strong> {ride.status}</p>
          <button type="button" onClick={() => cancelRide(ride.id)}>
            Cancel Ride
          </button>
        </div>
      ))}
    </div>
  );
}

export default Cancelride;