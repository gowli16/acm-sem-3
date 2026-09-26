
function Login(){
    return(
        <>
            <div className="login">
                <form>
                    <input type="text" placeholder="username"/>
                    <input type="password" placeholder="password"/>
                    <button type="submit">Login</button>
                    <button type="submit">click here to signup!!</button>
                </form>
            </div>
        </>
    );

}

export default Login;