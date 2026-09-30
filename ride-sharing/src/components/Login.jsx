import {useNavigate} from "react-router-dom";
function Login(){
    const navigate = useNavigate();
    return(
        <>
            <div className="login">
                <form>
                    <input type="text" placeholder="username"/>
                    <br/>
                    <input type="password" placeholder="password"/>
                    <br/>
                    <button type="submit">Login</button>
                    <br/>
                    <button type="submit" onClick={() => navigate("/signup")}>
                        click here to signup!!
                    </button>
                </form>
            </div>
        </>
    );

}

export default Login;