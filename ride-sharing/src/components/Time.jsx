
function Time({time, setTime}){
    return(
        <div className="time">
            <h1>What time do you want to leave</h1>
            <input 
                type="time" 
                id="time" 
                name="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
            />
        </div>
    );  
}

export default Time;