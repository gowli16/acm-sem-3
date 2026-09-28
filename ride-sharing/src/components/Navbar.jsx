
function Navbar(){

    return(
        <>
            <div className="navbar">
                <nav>
                    <link to="/"> Home </link>
                    <link to="/new-request"> New Request </link>
                    <link to="/cancel-request"> Cancel Request </link>
                    <link to="/cancel-ride"> Cancel Ride </link>
                </nav>
            </div>
        </>
    )


}

export default Navbar;