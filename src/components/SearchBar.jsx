function SearchBar({ value, onChange }) {
    return (
        <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
                type="text"
                className="search-input"
                placeholder="Search Pokémon by name..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Search Pokémon"
            />
        </div>
    );
}

export default SearchBar;
