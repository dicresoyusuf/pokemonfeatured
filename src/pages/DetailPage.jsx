import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemon';
import StatBar from '../components/StatBar';
import EvolutionChain from '../components/EvolutionChain';
import AbilitiesInfo from '../components/AbilitiesInfo';
import SpeciesInfo from '../components/SpeciesInfo';
import MovesList from '../components/MovesList';
import LocationEncounters from '../components/LocationEncounters';
import Loading from '../components/Loading';
import Error from '../components/Error';

function DetailPage() {
    const { id } = useParams();
    const { pokemon, loading, error, refetch } = usePokemonDetail(id);
    const [isShiny, setIsShiny] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const formatId = (id) => {
        return `#${String(id).padStart(3, '0')}`;
    };

    const getImageUrl = (shiny = false) => {
        if (!pokemon) return '';

        if (shiny) {
            // Try to get shiny artwork
            return pokemon.sprites?.other?.['official-artwork']?.front_shiny
                || pokemon.sprites?.front_shiny
                || pokemon.sprites?.other?.['official-artwork']?.front_default
                || '/placeholder.png';
        }

        return pokemon.sprites?.other?.['official-artwork']?.front_default
            || pokemon.sprites?.other?.dream_world?.front_default
            || pokemon.sprites?.front_default
            || '/placeholder.png';
    };

    const getCryUrl = () => {
        if (!pokemon) return '';
        // Pokemon cries are available in the sprites
        return pokemon.cries?.latest || pokemon.cries?.legacy || '';
    };

    const playCry = () => {
        const cryUrl = getCryUrl();
        if (!cryUrl) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        audioRef.current = new Audio(cryUrl);
        audioRef.current.volume = 0.3;

        setIsPlaying(true);
        audioRef.current.play().catch(() => setIsPlaying(false));

        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => setIsPlaying(false);
    };

    const formatHeight = (height) => {
        return `${(height / 10).toFixed(1)} m`;
    };

    const formatWeight = (weight) => {
        return `${(weight / 10).toFixed(1)} kg`;
    };

    if (loading) {
        return (
            <div className="container">
                <Loading message="Loading Pokémon details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <Error message={error} onRetry={refetch} />
            </div>
        );
    }

    if (!pokemon) {
        return (
            <div className="container">
                <Error message="Pokémon not found" />
            </div>
        );
    }

    const hasShiny = pokemon.sprites?.other?.['official-artwork']?.front_shiny || pokemon.sprites?.front_shiny;
    const hasCry = getCryUrl();

    return (
        <div className="detail-page">
            <div className="container">
                {/* Back Button */}
                <Link to="/" className="back-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to List
                </Link>

                {/* Hero Section */}
                <div className="detail-hero">
                    <div className="detail-image-container">
                        <div className={`detail-image-bg ${isShiny ? 'shiny' : ''}`}></div>
                        <img
                            className={`detail-image ${isShiny ? 'shiny-glow' : ''}`}
                            src={getImageUrl(isShiny)}
                            alt={pokemon.name}
                        />

                        {/* Action Buttons */}
                        <div className="detail-actions">
                            {hasShiny && (
                                <button
                                    className={`action-btn shiny-btn ${isShiny ? 'active' : ''}`}
                                    onClick={() => setIsShiny(!isShiny)}
                                    title={isShiny ? 'Show Normal' : 'Show Shiny'}
                                >
                                    <span className="action-icon">✨</span>
                                    <span className="action-text">{isShiny ? 'Normal' : 'Shiny'}</span>
                                </button>
                            )}

                            {hasCry && (
                                <button
                                    className={`action-btn cry-btn ${isPlaying ? 'playing' : ''}`}
                                    onClick={playCry}
                                    title="Play Cry"
                                    disabled={isPlaying}
                                >
                                    <span className="action-icon">{isPlaying ? '🔊' : '🔈'}</span>
                                    <span className="action-text">{isPlaying ? 'Playing...' : 'Cry'}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="detail-info">
                        <span className="detail-number">{formatId(pokemon.id)}</span>
                        <h1 className="detail-name">
                            {pokemon.name}
                            {isShiny && <span className="shiny-badge">✨ Shiny</span>}
                        </h1>

                        <div className="detail-types">
                            {pokemon.types.map(({ type }) => (
                                <span
                                    key={type.name}
                                    className={`type-badge type-${type.name}`}
                                >
                                    {type.name}
                                </span>
                            ))}
                        </div>

                        <div className="detail-physical">
                            <div className="physical-stat">
                                <span className="physical-stat-label">Height</span>
                                <span className="physical-stat-value">{formatHeight(pokemon.height)}</span>
                            </div>
                            <div className="physical-stat">
                                <span className="physical-stat-label">Weight</span>
                                <span className="physical-stat-value">{formatWeight(pokemon.weight)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Species Info */}
                <SpeciesInfo pokemonId={id} />

                {/* Abilities */}
                <AbilitiesInfo pokemon={pokemon} />

                {/* Stats Section */}
                <section className="stats-section">
                    <h2 className="stats-title">Base Stats</h2>
                    <div className="stats-grid">
                        {pokemon.stats.map((stat) => (
                            <StatBar key={stat.stat.name} stat={stat} />
                        ))}
                    </div>
                </section>

                {/* Evolution Chain */}
                <EvolutionChain pokemonId={id} />

                {/* Moves List */}
                <MovesList pokemon={pokemon} />

                {/* Location Encounters */}
                <LocationEncounters pokemonId={id} />
            </div>
        </div>
    );
}

export default DetailPage;
