function Error({ message = "Something went wrong", onRetry }) {
    return (
        <div className="error-container">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <h2 className="error-title">Oops!</h2>
            <p className="error-message">{message}</p>
            {onRetry && (
                <button className="retry-btn" onClick={onRetry}>
                    Try Again
                </button>
            )}
        </div>
    );
}

export default Error;
