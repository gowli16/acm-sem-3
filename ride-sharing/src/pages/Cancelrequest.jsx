
import { useEffect, useState } from "react";

const apiUrl = "http://localhost:5000";

function Cancelrequest() {
  const userId = localStorage.getItem("userId");
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return;

    fetch(`${apiUrl}/requests/user/${userId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load requests");
        setRequests(data);
      })
      .catch((error) => setMessage(error.message));
  }, [userId]);

  async function cancelRequest(requestId) {
    try {
      const response = await fetch(`${apiUrl}/requests/${requestId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not cancel request");

      setRequests((currentRequests) => currentRequests.filter((request) => request.id !== requestId));
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || "Could not connect to the server");
    }
  }

  return (
    <div className="cancelrequest">
      <h1>Cancel Request</h1>
      {!userId && <p>Please log in to view your requests</p>}
      {message && <p role="status">{message}</p>}
      {requests.map((request) => (
        <div className="requestcard" key={request.id}>
          <p><strong>Location:</strong> {request.location}</p>
          <p><strong>Date:</strong> {String(request.date).slice(0, 10)}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <button type="button" onClick={() => cancelRequest(request.id)}>
            Cancel Request
          </button>
        </div>
      ))}
    </div>
  );
}

export default Cancelrequest;