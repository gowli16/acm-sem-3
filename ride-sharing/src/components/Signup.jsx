import {useNavigate} from "react-router-dom";   
function Signup(){
    const navigate = useNavigate();
    return(
        <>
            <div className="signup">
                <input type="text" placeholder="username"/>
                <br/>
                <input type="password" placeholder="password"/>
                <br/>
                <button type="submit">Sign Up</button>
                <br/>
                <button type="submit" onClick={() => navigate("/login")}>
                    click here to login!!
                </button>
            </div>
        </>
    );

}

export default Signup;