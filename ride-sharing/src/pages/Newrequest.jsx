import { useState } from "react";
import Location from "../components/Location";
import Date from "../components/Date";
import Member from "../components/Member";
import Train from "../components/Train";
import Time from "../components/Time";
import Requestcard from "../components/Requestcard";
function Newrequest() {
    const [step, setStep] = useState(1);
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [members, setMembers] = useState(1);
    const [train, setTrain] = useState("");
    const [time, setTime] = useState("");

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
            />}
            {step < 6 && (
                <button onClick={() => setStep(step + 1)}>Next</button>
            )}
        </div>
    );
}

export default Newrequest;