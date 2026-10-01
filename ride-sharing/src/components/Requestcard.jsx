
function Requestcard({ location, date, members, train, time, onCreate, isCreating }) {
    return(
        <div className="requestcard">
            <h1>Your Request</h1>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Members:</strong> {members}</p>
            <p><strong>Train:</strong> {train}</p>
            <p><strong>Time:</strong> {time}</p>
            <button type="button" onClick={onCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Request"}
            </button>
        </div>
    );
}

export default Requestcard;