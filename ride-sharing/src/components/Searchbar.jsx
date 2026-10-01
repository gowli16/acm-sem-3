
function Searchbar({ value, onChange }) {
    return (
        <div className="search">
            <input
                type="text"
                placeholder=" search for requests"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Searchbar;