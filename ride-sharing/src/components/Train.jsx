import { useState } from "react";

function Train({ train, setTrain, location }) {

    const [leaveTime, setLeaveTime] = useState("");

    function calculateTime() {

        let time = train.split(":");

        let hours = Number(time[0]);
        let minutes = Number(time[1]);

        if (location === "Karunagappalli") {
            minutes = minutes - 30;
        }

        if (location === "Kayamkulam") {
            minutes = minutes - 45;
        }

        if (minutes < 0) {
            minutes = minutes + 60;
            hours = hours - 1;
        }

        setLeaveTime(hours + ":" + minutes);
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