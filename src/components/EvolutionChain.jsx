import { Link } from 'react-router-dom';
import { useEvolutionChain } from '../hooks/usePokemon';

function EvolutionChain({ pokemonId }) {
    const { evolutionChain, loading, error } = useEvolutionChain(pokemonId);

    if (loading) {
        return (
            <div className="evolution-section">
                <h2 className="evolution-title">Evolution Chain</h2>
                <div className="evolution-loading">
                    <div className="evolution-skeleton"></div>
                    <div className="evolution-skeleton"></div>
                    <div className="evolution-skeleton"></div>
                </div>
            </div>
        );
    }

    if (error || evolutionChain.length === 0) {
        return null;
    }

    const getEvolutionTrigger = (pokemon) => {
        if (!pokemon.trigger) return null;

        if (pokemon.minLevel) {
            return `Level ${pokemon.minLevel}`;
        }

        if (pokemon.item) {
            return pokemon.item.replace(/-/g, ' ');
        }

        if (pokemon.trigger === 'trade') {
            return 'Trade';
        }

        if (pokemon.trigger === 'use-item') {
            return pokemon.item ? pokemon.item.replace(/-/g, ' ') : 'Use Item';
        }

        return pokemon.trigger.replace(/-/g, ' ');
    };

    // Group by stage for display
    const stages = evolutionChain.reduce((acc, pokemon) => {
        if (!acc[pokemon.stage]) {
            acc[pokemon.stage] = [];
        }
        acc[pokemon.stage].push(pokemon);
        return acc;
    }, {});

    const stageNumbers = Object.keys(stages).sort((a, b) => a - b);

    return (
        <section className="evolution-section">
            <h2 className="evolution-title">Evolution Chain</h2>

            <div className="evolution-chain">
                {stageNumbers.map((stageNum, stageIndex) => (
                    <div key={stageNum} className="evolution-stage-group">
                        {stageIndex > 0 && (
                            <div className="evolution-arrow">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}

                        <div className="evolution-stage">
                            {stages[stageNum].map((pokemon, index) => (
                                <Link
                                    to={`/pokemon/${pokemon.id}`}
                                    key={pokemon.id}
                                    className={`evolution-card ${pokemon.id === parseInt(pokemonId) ? 'current' : ''}`}
                                >
                                    {stageIndex > 0 && (
                                        <div className="evolution-trigger">
                                            {getEvolutionTrigger(pokemon) || '???'}
                                        </div>
                                    )}

                                    <div className="evolution-image-container">
                                        <img
                                            src={pokemon.image}
                                            alt={pokemon.name}
                                            className="evolution-image"
                                        />
                                    </div>

                                    <span className="evolution-id">#{String(pokemon.id).padStart(3, '0')}</span>
                                    <span className="evolution-name">{pokemon.name}</span>

                                    <div className="evolution-types">
                                        {pokemon.types.map(({ type }) => (
                                            <span
                                                key={type.name}
                                                className={`type-badge small type-${type.name}`}
                                            >
                                                {type.name}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {evolutionChain.length === 1 && (
                <p className="no-evolution">This Pokémon does not evolve.</p>
            )}
        </section>
    );
}

export default EvolutionChain;
