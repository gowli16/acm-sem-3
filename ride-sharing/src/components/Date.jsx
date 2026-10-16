
function Date({date, setDate}) {
    const currentDate = new window.Date();
    const minDate = [
        currentDate.getFullYear(),
        String(currentDate.getMonth() + 1).padStart(2, "0"),
        String(currentDate.getDate()).padStart(2, "0")
    ].join("-");

    return(
        <>
            <div className="date">
                <h1>When are you leaving?</h1>
                <label>Select Date:</label>
                <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={date}
                    min={minDate}
                    onChange={(e) => setDate(e.target.value)} 
                />
            </div>
        </>
    );
}

export default Date;