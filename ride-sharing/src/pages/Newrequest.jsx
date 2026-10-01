import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Location from "../components/Location";
import Date from "../components/Date";
import Member from "../components/Member";
import Train from "../components/Train";
import Time from "../components/Time";
import Requestcard from "../components/Requestcard";
function Newrequest() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [members, setMembers] = useState(1);
    const [train, setTrain] = useState("");
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    async function createRequest() {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setMessage("Please log in before creating a request");
            return;
        }

        setIsCreating(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: Number(userId),
                    location,
                    date,
                    members,
                    train,
                    time
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Could not create request");

            navigate("/dashboard");
        } catch (error) {
            setMessage(error.message || "Could not connect to the server");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="newrequest">
            {step === 1 && <Location
                location={location}
                setLocation={setLocation}
            />}
            {step === 2 && <Date
                date={date}
                setDate={setDate}
            />}
            {step === 3 && <Member
                members={members}
                setMembers={setMembers}
            />}
            {step === 4 && <Train
                train={train}
                setTrain={setTrain}
                location={location}
            />}
            {step === 5 && <Time
                time={time}
                setTime={setTime}
            />}
            {step === 6 && <Requestcard
                location={location}
                date={date}
                members={members}
                train={train}
                time={time}
                onCreate={createRequest}
                isCreating={isCreating}
            />}
            {message && <p role="alert">{message}</p>}
            {step < 6 && (
                <button onClick={() => setStep(step + 1)}>Next</button>
            )}
        </div>
    );
}

export default Newrequest;