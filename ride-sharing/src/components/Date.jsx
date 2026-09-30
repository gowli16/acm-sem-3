
function Date(){
    return(
        <>
            <div className="date">
                <h1>When are you leaving?</h1>
                <label>Select Date:</label>
                <input type="date" id="date" name="date" />
            </div>
        </>
    );
}

export default Date;