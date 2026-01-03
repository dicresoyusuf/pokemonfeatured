import { useEncounters } from '../hooks/usePokemon';

function LocationEncounters({ pokemonId }) {
    const { encounters, loading, error } = useEncounters(pokemonId);

    if (loading) {
        return (
            <section className="encounters-section">
                <h2 className="section-title">Locations</h2>
                <div className="encounters-loading">
                    <div className="encounter-skeleton"></div>
                    <div className="encounter-skeleton"></div>
                </div>
            </section>
        );
    }

    if (error) {
        return null;
    }

    if (encounters.length === 0) {
        return (
            <section className="encounters-section">
                <h2 className="section-title">Locations</h2>
                <p className="no-encounters">
                    This Pokémon cannot be found in the wild.
                </p>
            </section>
        );
    }

    return (
        <section className="encounters-section">
            <h2 className="section-title">Locations</h2>
            <div className="encounters-grid">
                {encounters.map((encounter, index) => (
                    <div key={index} className="encounter-card">
                        <div className="encounter-location">
                            <span className="location-icon">📍</span>
                            <span className="location-name">{encounter.locationName}</span>
                        </div>
                        <div className="encounter-chance">
                            <div className="chance-bar">
                                <div
                                    className="chance-fill"
                                    style={{ width: `${encounter.maxChance}%` }}
                                ></div>
                            </div>
                            <span className="chance-text">{encounter.maxChance}% chance</span>
                        </div>
                        <div className="encounter-versions">
                            {encounter.versions.slice(0, 3).map((version, i) => (
                                <span key={i} className="version-badge">
                                    {version}
                                </span>
                            ))}
                            {encounter.versions.length > 3 && (
                                <span className="version-badge more">
                                    +{encounter.versions.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LocationEncounters;
