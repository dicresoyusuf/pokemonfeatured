import { useState, useMemo } from 'react';
import { useAllPokemon } from '../hooks/usePokemon';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Link } from 'react-router-dom';

const STAT_NAMES = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
};

const STAT_COLORS = {
    'hp': '#ff5959',
    'attack': '#f5ac78',
    'defense': '#fae078',
    'special-attack': '#9db7f5',
    'special-defense': '#a7db8d',
    'speed': '#fa92b2'
};

function ComparePage() {
    const { allPokemon, loading, error } = useAllPokemon();
    const [pokemon1, setPokemon1] = useState(null);
    const [pokemon2, setPokemon2] = useState(null);
    const [search1, setSearch1] = useState('');
    const [search2, setSearch2] = useState('');
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);

    const filteredPokemon1 = useMemo(() => {
        if (!search1.trim()) return allPokemon.slice(0, 10);
        return allPokemon.filter(p =>
            p.name.toLowerCase().includes(search1.toLowerCase())
        ).slice(0, 10);
    }, [search1, allPokemon]);

    const filteredPokemon2 = useMemo(() => {
        if (!search2.trim()) return allPokemon.slice(0, 10);
        return allPokemon.filter(p =>
            p.name.toLowerCase().includes(search2.toLowerCase())
        ).slice(0, 10);
    }, [search2, allPokemon]);

    const selectPokemon1 = (pokemon) => {
        setPokemon1(pokemon);
        setSearch1(pokemon.name);
        setShowDropdown1(false);
    };

    const selectPokemon2 = (pokemon) => {
        setPokemon2(pokemon);
        setSearch2(pokemon.name);
        setShowDropdown2(false);
    };

    const getImageUrl = (pokemon) => {
        if (!pokemon) return '';
        return pokemon.sprites?.other?.['official-artwork']?.front_default
            || pokemon.sprites?.other?.dream_world?.front_default
            || pokemon.sprites?.front_default
            || '/placeholder.png';
    };

    const getStatValue = (pokemon, statName) => {
        if (!pokemon) return 0;
        const stat = pokemon.stats.find(s => s.stat.name === statName);
        return stat ? stat.base_stat : 0;
    };

    const getTotalStats = (pokemon) => {
        if (!pokemon) return 0;
        return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
    };

    const getStatComparison = (stat1, stat2) => {
        if (stat1 > stat2) return 'winner';
        if (stat1 < stat2) return 'loser';
        return 'tie';
    };

    const swapPokemon = () => {
        const temp1 = pokemon1;
        const tempSearch1 = search1;
        setPokemon1(pokemon2);
        setSearch1(search2);
        setPokemon2(temp1);
        setSearch2(tempSearch1);
    };

    if (loading) {
        return (
            <div className="container">
                <Loading message="Loading Pokémon data..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <Error message={error} />
            </div>
        );
    }

    return (
        <div className="compare-page">
            <div className="container">
                {/* Back Button */}
                <Link to="/" className="back-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to List
                </Link>

                {/* Header */}
                <div className="compare-header">
                    <h1 className="compare-title">
                        Compare <span>Pokémon</span>
                    </h1>
                    <p className="compare-subtitle">
                        Select two Pokémon to compare their stats side by side
                    </p>
                </div>

                {/* Selection Area */}
                <div className="compare-selection">
                    {/* Pokemon 1 Selector */}
                    <div className="pokemon-selector">
                        <div className="selector-search">
                            <input
                                type="text"
                                placeholder="Search Pokémon..."
                                value={search1}
                                onChange={(e) => {
                                    setSearch1(e.target.value);
                                    setShowDropdown1(true);
                                    if (!e.target.value) setPokemon1(null);
                                }}
                                onFocus={() => setShowDropdown1(true)}
                                onBlur={() => setTimeout(() => setShowDropdown1(false), 200)}
                                className="selector-input"
                            />
                            {showDropdown1 && filteredPokemon1.length > 0 && (
                                <div className="selector-dropdown">
                                    {filteredPokemon1.map(p => (
                                        <div
                                            key={p.id}
                                            className="selector-option"
                                            onClick={() => selectPokemon1(p)}
                                        >
                                            <img
                                                src={p.sprites?.front_default}
                                                alt={p.name}
                                                className="selector-option-img"
                                            />
                                            <span className="selector-option-name">{p.name}</span>
                                            <span className="selector-option-id">#{String(p.id).padStart(3, '0')}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={`pokemon-preview ${pokemon1 ? 'selected' : 'empty'}`}>
                            {pokemon1 ? (
                                <>
                                    <img
                                        src={getImageUrl(pokemon1)}
                                        alt={pokemon1.name}
                                        className="preview-image"
                                    />
                                    <h3 className="preview-name">{pokemon1.name}</h3>
                                    <div className="preview-types">
                                        {pokemon1.types.map(({ type }) => (
                                            <span key={type.name} className={`type-badge type-${type.name}`}>
                                                {type.name}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="preview-placeholder">
                                    <span className="placeholder-icon">❓</span>
                                    <span>Select a Pokémon</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* VS Badge & Swap */}
                    <div className="compare-vs">
                        <div className="vs-badge">VS</div>
                        <button className="swap-btn" onClick={swapPokemon} title="Swap Pokémon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 16L3 12M3 12L7 8M3 12H21M17 8L21 12M21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Pokemon 2 Selector */}
                    <div className="pokemon-selector">
                        <div className="selector-search">
                            <input
                                type="text"
                                placeholder="Search Pokémon..."
                                value={search2}
                                onChange={(e) => {
                                    setSearch2(e.target.value);
                                    setShowDropdown2(true);
                                    if (!e.target.value) setPokemon2(null);
                                }}
                                onFocus={() => setShowDropdown2(true)}
                                onBlur={() => setTimeout(() => setShowDropdown2(false), 200)}
                                className="selector-input"
                            />
                            {showDropdown2 && filteredPokemon2.length > 0 && (
                                <div className="selector-dropdown">
                                    {filteredPokemon2.map(p => (
                                        <div
                                            key={p.id}
                                            className="selector-option"
                                            onClick={() => selectPokemon2(p)}
                                        >
                                            <img
                                                src={p.sprites?.front_default}
                                                alt={p.name}
                                                className="selector-option-img"
                                            />
                                            <span className="selector-option-name">{p.name}</span>
                                            <span className="selector-option-id">#{String(p.id).padStart(3, '0')}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={`pokemon-preview ${pokemon2 ? 'selected' : 'empty'}`}>
                            {pokemon2 ? (
                                <>
                                    <img
                                        src={getImageUrl(pokemon2)}
                                        alt={pokemon2.name}
                                        className="preview-image"
                                    />
                                    <h3 className="preview-name">{pokemon2.name}</h3>
                                    <div className="preview-types">
                                        {pokemon2.types.map(({ type }) => (
                                            <span key={type.name} className={`type-badge type-${type.name}`}>
                                                {type.name}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="preview-placeholder">
                                    <span className="placeholder-icon">❓</span>
                                    <span>Select a Pokémon</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Comparison */}
                {pokemon1 && pokemon2 && (
                    <div className="stats-comparison">
                        <h2 className="comparison-title">Stats Comparison</h2>

                        <div className="comparison-grid">
                            {Object.keys(STAT_NAMES).map(statName => {
                                const stat1 = getStatValue(pokemon1, statName);
                                const stat2 = getStatValue(pokemon2, statName);
                                const comparison = getStatComparison(stat1, stat2);
                                const maxStat = 255;

                                return (
                                    <div key={statName} className="comparison-row">
                                        <div className={`stat-value left ${comparison === 'winner' ? 'highlight' : ''}`}>
                                            {stat1}
                                        </div>
                                        <div className="stat-bars">
                                            <div className="stat-bar-left">
                                                <div
                                                    className={`bar-fill left ${comparison === 'winner' ? 'winner' : ''}`}
                                                    style={{
                                                        width: `${(stat1 / maxStat) * 100}%`,
                                                        backgroundColor: STAT_COLORS[statName]
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="stat-label" style={{ color: STAT_COLORS[statName] }}>
                                                {STAT_NAMES[statName]}
                                            </span>
                                            <div className="stat-bar-right">
                                                <div
                                                    className={`bar-fill right ${comparison === 'loser' ? '' : comparison === 'winner' ? '' : ''} ${comparison === 'loser' ? '' : comparison === 'tie' ? '' : ''}`}
                                                    style={{
                                                        width: `${(stat2 / maxStat) * 100}%`,
                                                        backgroundColor: STAT_COLORS[statName],
                                                        opacity: comparison === 'winner' ? 0.5 : 1
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className={`stat-value right ${comparison === 'loser' ? 'highlight' : ''}`}>
                                            {stat2}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Total Stats */}
                            <div className="comparison-row total">
                                <div className={`stat-value left ${getTotalStats(pokemon1) > getTotalStats(pokemon2) ? 'highlight winner-total' : ''}`}>
                                    {getTotalStats(pokemon1)}
                                </div>
                                <div className="stat-bars">
                                    <span className="stat-label total-label">TOTAL</span>
                                </div>
                                <div className={`stat-value right ${getTotalStats(pokemon2) > getTotalStats(pokemon1) ? 'highlight winner-total' : ''}`}>
                                    {getTotalStats(pokemon2)}
                                </div>
                            </div>
                        </div>

                        {/* Physical Stats */}
                        <div className="physical-comparison">
                            <div className="physical-card">
                                <h4>{pokemon1.name}</h4>
                                <div className="physical-stats">
                                    <div className="physical-item">
                                        <span className="physical-label">Height</span>
                                        <span className="physical-value">{(pokemon1.height / 10).toFixed(1)} m</span>
                                    </div>
                                    <div className="physical-item">
                                        <span className="physical-label">Weight</span>
                                        <span className="physical-value">{(pokemon1.weight / 10).toFixed(1)} kg</span>
                                    </div>
                                </div>
                            </div>

                            <div className="physical-card">
                                <h4>{pokemon2.name}</h4>
                                <div className="physical-stats">
                                    <div className="physical-item">
                                        <span className="physical-label">Height</span>
                                        <span className="physical-value">{(pokemon2.height / 10).toFixed(1)} m</span>
                                    </div>
                                    <div className="physical-item">
                                        <span className="physical-label">Weight</span>
                                        <span className="physical-value">{(pokemon2.weight / 10).toFixed(1)} kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Winner Declaration */}
                        <div className="winner-section">
                            {getTotalStats(pokemon1) > getTotalStats(pokemon2) ? (
                                <div className="winner-card">
                                    <span className="winner-crown">👑</span>
                                    <span className="winner-text">
                                        <strong>{pokemon1.name}</strong> has higher total stats!
                                    </span>
                                </div>
                            ) : getTotalStats(pokemon2) > getTotalStats(pokemon1) ? (
                                <div className="winner-card">
                                    <span className="winner-crown">👑</span>
                                    <span className="winner-text">
                                        <strong>{pokemon2.name}</strong> has higher total stats!
                                    </span>
                                </div>
                            ) : (
                                <div className="winner-card tie">
                                    <span className="winner-crown">🤝</span>
                                    <span className="winner-text">It's a tie!</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ComparePage;
