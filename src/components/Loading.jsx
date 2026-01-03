function Loading({ message = "Loading Pokémon..." }) {
    return (
        <div className="loading-container">
            <div className="loading-gif-container">
                <img
                    src="/loading.gif"
                    alt="Loading"
                    className="loading-gif"
                />
            </div>
            <p className="loading-text">{message}</p>
        </div>
    );
}

export default Loading;
