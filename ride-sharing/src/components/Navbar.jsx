import { Link } from "react-router-dom";
function Navbar(){
    return(
        <>
            <div className="navbar">
                <nav>
                    <Link to="/dashboard"> Home </Link>
                    <Link to="/new-request"> New Request </Link>
                    <Link to="/cancel-request"> Cancel Request </Link>
                    <Link to="/cancel-ride"> Cancel Ride </Link>
                    <Link to="/login"> Login </Link>
                </nav>
            </div>
        </>
    )


}

export default Navbar;