import { useState } from "react";

function Train({ train, setTrain, location }) {

    const [leaveTime, setLeaveTime] = useState("");

    function calculateTime() {
        if (!train) {
            setLeaveTime("");
            return;
        }

        const [trainHours, trainMinutes] = train.split(":").map(Number);
        const minutesBefore = location === "Karunagappalli" ? 30 : location === "Kayamkulam" ? 45 : 0;
        const totalMinutes = (trainHours * 60 + trainMinutes - minutesBefore + 1440) % 1440;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setLeaveTime(
            new window.Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })
        );
    }

    return (
        <div className="train">
            <h1>When is your train?</h1>
            <label>Train time:</label>
            <input
                type="time"
                value={train}
                onChange={(e) => setTrain(e.target.value)}
            />
            <br />
            <br />
            <button onClick={calculateTime}>
                Calculate
            </button>
            {leaveTime && (
                <p>
                    You should leave at <strong>{leaveTime}</strong>
                </p>
            )}

        </div>
    );
}

export default Train;