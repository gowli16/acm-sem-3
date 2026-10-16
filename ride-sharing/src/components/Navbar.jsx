import { Link, useNavigate } from "react-router-dom";
function Navbar(){
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem("userId"));

    function handleLogout() {
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        navigate("/login");
    }
    return(
        <>
            <div className="navbar">
                <nav>
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard">Home</Link>
                            <Link to="/new-request">New Request</Link>
                            <Link to="/cancel-request">Cancel Request</Link>
                            <Link to="/cancel-ride">Cancel Ride</Link>
                            <button className="logoutButton" type="button" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/">Home</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </>
    )


}

export default Navbar;