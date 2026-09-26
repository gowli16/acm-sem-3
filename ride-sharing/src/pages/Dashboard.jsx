import Searchbar from "../components/Searchbar";
function Dashboard() {
    return(
        <>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <Searchbar/>
                <p>Welcome to your dashboard!</p>
                <p>Here you can see YOUR requests and search for rides.</p>
            </div>
        </>
    );

}

export default Dashboard;