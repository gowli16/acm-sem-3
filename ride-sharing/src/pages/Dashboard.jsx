import Searchbar from "../components/Searchbar";
function Dashboard() {
    return(
        <>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <Searchbar/>
                <p>Welcome to your dashboard!</p>
                <p>Here you can see YOUR requests and search for rides.</p>
                <div className="rules">
                    <h1>General Rules</h1>
                    <p>You must create a ride minimum of 1 day prior to the departure day</p>
                    <p>You can cancel a ride up to 24 hours before the departure time</p>
                    <p>The person who creates the ride is responsible for telling the warden about the auto</p>
                </div>
                <h1>My Requests</h1>
            </div>
        </>
    );

}

export default Dashboard;