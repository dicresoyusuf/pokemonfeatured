import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <svg className="logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path d="M2 50 H40" stroke="currentColor" strokeWidth="4" />
                        <path d="M60 50 H98" stroke="currentColor" strokeWidth="4" />
                        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="4" fill="none" />
                        <circle cx="50" cy="50" r="8" fill="currentColor" />
                    </svg>
                    PokéDex
                </Link>

                <nav className="header-nav">
                    <Link to="/types" className="nav-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Types
                    </Link>
                    <Link to="/compare" className="nav-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3H21V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 20L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 16V21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 15L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 4L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Compare
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
