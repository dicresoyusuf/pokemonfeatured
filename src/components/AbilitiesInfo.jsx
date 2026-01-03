import { useAbilities } from '../hooks/usePokemon';

function AbilitiesInfo({ pokemon }) {
    const { abilities, loading, error } = useAbilities(pokemon);

    if (loading) {
        return (
            <section className="abilities-section">
                <h2 className="section-title">Abilities</h2>
                <div className="abilities-loading">
                    <div className="ability-skeleton"></div>
                    <div className="ability-skeleton"></div>
                </div>
            </section>
        );
    }

    if (error || abilities.length === 0) {
        return null;
    }

    return (
        <section className="abilities-section">
            <h2 className="section-title">Abilities</h2>
            <div className="abilities-grid">
                {abilities.map((ability) => (
                    <div
                        key={ability.name}
                        className={`ability-card ${ability.isHidden ? 'hidden-ability' : ''}`}
                    >
                        <div className="ability-header">
                            <span className="ability-icon">
                                {ability.isHidden ? '🔒' : '✨'}
                            </span>
                            <h3 className="ability-name">
                                {ability.name.replace(/-/g, ' ')}
                            </h3>
                            {ability.isHidden && (
                                <span className="hidden-badge">Hidden</span>
                            )}
                        </div>
                        <p className="ability-description">
                            {ability.effect}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AbilitiesInfo;
