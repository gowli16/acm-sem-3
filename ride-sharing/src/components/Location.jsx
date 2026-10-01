function Location({ location, setLocation }) {
    return (
        <div className="location">
            <h1>Where do you want to go?</h1>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="abc">Select a station</option>
                <option value="Kayamkulam">Kayamkulam </option>
                <option value="Karunagappalli">Karunagappalli</option>
            </select>
        </div>
    );
}

export default Location;