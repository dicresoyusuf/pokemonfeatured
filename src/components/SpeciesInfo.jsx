import { useSpecies } from '../hooks/usePokemon';

function SpeciesInfo({ pokemonId }) {
    const { species, loading, error } = useSpecies(pokemonId);

    if (loading) {
        return (
            <section className="species-section">
                <h2 className="section-title">About</h2>
                <div className="species-loading">
                    <div className="species-skeleton text"></div>
                    <div className="species-skeleton stats"></div>
                </div>
            </section>
        );
    }

    if (error || !species) {
        return null;
    }

    return (
        <section className="species-section">
            <h2 className="section-title">About</h2>

            {/* Flavor Text */}
            {species.flavorText && (
                <div className="species-flavor">
                    <p className="flavor-text">"{species.flavorText}"</p>
                    {species.genus && (
                        <span className="species-genus">{species.genus}</span>
                    )}
                </div>
            )}

            {/* Badges for Legendary/Mythical */}
            {(species.isLegendary || species.isMythical) && (
                <div className="species-badges">
                    {species.isLegendary && (
                        <span className="legendary-badge">⭐ Legendary</span>
                    )}
                    {species.isMythical && (
                        <span className="mythical-badge">✨ Mythical</span>
                    )}
                </div>
            )}

            {/* Species Stats Grid */}
            <div className="species-stats-grid">
                {species.habitat && (
                    <div className="species-stat-item">
                        <span className="species-stat-icon">🏔️</span>
                        <span className="species-stat-label">Habitat</span>
                        <span className="species-stat-value">{species.habitat}</span>
                    </div>
                )}

                {species.captureRate !== undefined && (
                    <div className="species-stat-item">
                        <span className="species-stat-icon">🎯</span>
                        <span className="species-stat-label">Capture Rate</span>
                        <span className="species-stat-value">{species.captureRate}</span>
                    </div>
                )}

                {species.baseHappiness !== undefined && (
                    <div className="species-stat-item">
                        <span className="species-stat-icon">💖</span>
                        <span className="species-stat-label">Base Happiness</span>
                        <span className="species-stat-value">{species.baseHappiness}</span>
                    </div>
                )}

                {species.growthRate && (
                    <div className="species-stat-item">
                        <span className="species-stat-icon">📈</span>
                        <span className="species-stat-label">Growth Rate</span>
                        <span className="species-stat-value">{species.growthRate.replace(/-/g, ' ')}</span>
                    </div>
                )}

                {species.eggGroups && species.eggGroups.length > 0 && (
                    <div className="species-stat-item">
                        <span className="species-stat-icon">🥚</span>
                        <span className="species-stat-label">Egg Groups</span>
                        <span className="species-stat-value">
                            {species.eggGroups.map(g => g.replace(/-/g, ' ')).join(', ')}
                        </span>
                    </div>
                )}

                {species.genderRatio && (
                    <div className="species-stat-item gender">
                        <span className="species-stat-icon">⚥</span>
                        <span className="species-stat-label">Gender Ratio</span>
                        <div className="gender-bar">
                            <div
                                className="gender-male"
                                style={{ width: `${species.genderRatio.male}%` }}
                                title={`Male: ${species.genderRatio.male}%`}
                            >
                                ♂ {species.genderRatio.male.toFixed(1)}%
                            </div>
                            <div
                                className="gender-female"
                                style={{ width: `${species.genderRatio.female}%` }}
                                title={`Female: ${species.genderRatio.female}%`}
                            >
                                ♀ {species.genderRatio.female.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                )}

                {!species.genderRatio && (
                    <div className="species-stat-item">
                        <span className="species-stat-icon">⚥</span>
                        <span className="species-stat-label">Gender</span>
                        <span className="species-stat-value">Genderless</span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default SpeciesInfo;
