
function Requestcard({ location, date, members, train, time }) {
    return(
        <div className="requestcard">
            <h1>Your Request</h1>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Members:</strong> {members}</p>
            <p><strong>Train:</strong> {train}</p>
            <p><strong>Time:</strong> {time}</p>
        </div>
    );
}

export default Requestcard;