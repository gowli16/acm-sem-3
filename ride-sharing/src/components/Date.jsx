
function Date({date, setDate}) {
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
                    onChange={(e) => setDate(e.target.value)} 
                />
            </div>
        </>
    );
}

export default Date;