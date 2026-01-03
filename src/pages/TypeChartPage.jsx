import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypes } from '../hooks/usePokemon';
import Loading from '../components/Loading';
import Error from '../components/Error';

const TYPE_ORDER = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

function TypeChartPage() {
    const { types, loading, error } = useTypes();
    const [selectedType, setSelectedType] = useState(null);
    const [viewMode, setViewMode] = useState('attacking'); // 'attacking' or 'defending'

    if (loading) {
        return (
            <div className="container">
                <Loading message="Loading type data..." />
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

    // Sort types by the defined order
    const sortedTypes = [...types].sort((a, b) => {
        return TYPE_ORDER.indexOf(a.name) - TYPE_ORDER.indexOf(b.name);
    });

    const getEffectiveness = (attackingType, defendingType) => {
        const attacker = sortedTypes.find(t => t.name === attackingType);
        if (!attacker) return 1;

        if (attacker.damageRelations.doubleDamageTo.includes(defendingType)) return 2;
        if (attacker.damageRelations.halfDamageTo.includes(defendingType)) return 0.5;
        if (attacker.damageRelations.noDamageTo.includes(defendingType)) return 0;
        return 1;
    };

    const getEffectivenessClass = (value) => {
        if (value === 2) return 'super-effective';
        if (value === 0.5) return 'not-effective';
        if (value === 0) return 'no-effect';
        return 'neutral';
    };

    const getEffectivenessLabel = (value) => {
        if (value === 2) return '2×';
        if (value === 0.5) return '½';
        if (value === 0) return '0';
        return '';
    };

    const getTypeInfo = (typeName) => {
        const type = sortedTypes.find(t => t.name === typeName);
        if (!type) return null;
        return type;
    };

    return (
        <div className="type-chart-page">
            <div className="container">
                {/* Back Button */}
                <Link to="/" className="back-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to List
                </Link>

                {/* Header */}
                <div className="type-chart-header">
                    <h1 className="type-chart-title">
                        Type <span>Effectiveness</span> Chart
                    </h1>
                    <p className="type-chart-subtitle">
                        Click on any type to see its strengths and weaknesses
                    </p>
                </div>

                {/* View Mode Toggle */}
                <div className="view-mode-toggle">
                    <button
                        className={`mode-btn ${viewMode === 'attacking' ? 'active' : ''}`}
                        onClick={() => setViewMode('attacking')}
                    >
                        ⚔️ Attacking
                    </button>
                    <button
                        className={`mode-btn ${viewMode === 'defending' ? 'active' : ''}`}
                        onClick={() => setViewMode('defending')}
                    >
                        🛡️ Defending
                    </button>
                </div>

                {/* Type Selector */}
                <div className="type-selector">
                    {sortedTypes.map(type => (
                        <button
                            key={type.name}
                            className={`type-btn type-${type.name} ${selectedType === type.name ? 'selected' : ''}`}
                            onClick={() => setSelectedType(selectedType === type.name ? null : type.name)}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>

                {/* Selected Type Info */}
                {selectedType && (
                    <div className="selected-type-info">
                        <div className={`selected-type-header type-${selectedType}-bg`}>
                            <h2>{selectedType}</h2>
                        </div>

                        {viewMode === 'attacking' ? (
                            <div className="type-relations">
                                <div className="relation-group">
                                    <h3 className="relation-title super">⚔️ Super Effective (2×)</h3>
                                    <div className="relation-types">
                                        {getTypeInfo(selectedType)?.damageRelations.doubleDamageTo.map(t => (
                                            <span key={t} className={`type-badge type-${t}`}>{t}</span>
                                        ))}
                                        {getTypeInfo(selectedType)?.damageRelations.doubleDamageTo.length === 0 && (
                                            <span className="no-types">None</span>
                                        )}
                                    </div>
                                </div>

                                <div className="relation-group">
                                    <h3 className="relation-title weak">🛡️ Not Very Effective (½×)</h3>
                                    <div className="relation-types">
                                        {getTypeInfo(selectedType)?.damageRelations.halfDamageTo.map(t => (
                                            <span key={t} className={`type-badge type-${t}`}>{t}</span>
                                        ))}
                                        {getTypeInfo(selectedType)?.damageRelations.halfDamageTo.length === 0 && (
                                            <span className="no-types">None</span>
                                        )}
                                    </div>
                                </div>

                                <div className="relation-group">
                                    <h3 className="relation-title immune">🚫 No Effect (0×)</h3>
                                    <div className="relation-types">
                                        {getTypeInfo(selectedType)?.damageRelations.noDamageTo.map(t => (
                                            <span key={t} className={`type-badge type-${t}`}>{t}</span>
                                        ))}
                                        {getTypeInfo(selectedType)?.damageRelations.noDamageTo.length === 0 && (
                                            <span className="no-types">None</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="type-relations">
                                <div className="relation-group">
                                    <h3 className="relation-title weak">⚠️ Weak To (2× damage)</h3>
                                    <div className="relation-types">
                                        {getTypeInfo(selectedType)?.damageRelations.doubleDamageFrom.map(t => (
                                            <span key={t} className={`type-badge type-${t}`}>{t}</span>
                                        ))}
                                        {getTypeInfo(selectedType)?.damageRelations.doubleDamageFrom.length === 0 && (
                                            <span className="no-types">None</span>
                                        )}
                                    </div>
                                </div>

                                <div className="relation-group">
                                    <h3 className="relation-title super">💪 Resistant To (½× damage)</h3>
                                    <div className="relation-types">
                                        {getTypeInfo(selectedType)?.damageRelations.halfDamageFrom.map(t => (
                                            <span key={t} className={`type-badge type-${t}`}>{t}</span>
                                        ))}
                                        {getTypeInfo(selectedType)?.damageRelations.halfDamageFrom.length === 0 && (
                                            <span className="no-types">None</span>
                                        )}
                                    </div>
                                </div>

                                <div className="relation-group">
                                    <h3 className="relation-title immune">🛡️ Immune To (0× damage)</h3>
                                    <div className="relation-types">
                                        {getTypeInfo(selectedType)?.damageRelations.noDamageFrom.map(t => (
                                            <span key={t} className={`type-badge type-${t}`}>{t}</span>
                                        ))}
                                        {getTypeInfo(selectedType)?.damageRelations.noDamageFrom.length === 0 && (
                                            <span className="no-types">None</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Full Type Chart Table */}
                <div className="type-chart-table-container">
                    <h2 className="chart-table-title">Full Type Chart</h2>
                    <p className="chart-table-subtitle">
                        Row = Attacking Type, Column = Defending Type
                    </p>

                    <div className="type-chart-scroll">
                        <table className="type-chart-table">
                            <thead>
                                <tr>
                                    <th className="corner-cell">ATK ↓ DEF →</th>
                                    {sortedTypes.map(type => (
                                        <th key={type.name} className={`type-header type-${type.name}-bg`}>
                                            {type.name.substring(0, 3).toUpperCase()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTypes.map(attackType => (
                                    <tr key={attackType.name}>
                                        <td className={`type-row-header type-${attackType.name}-bg`}>
                                            {attackType.name.substring(0, 3).toUpperCase()}
                                        </td>
                                        {sortedTypes.map(defendType => {
                                            const effectiveness = getEffectiveness(attackType.name, defendType.name);
                                            return (
                                                <td
                                                    key={defendType.name}
                                                    className={`effectiveness-cell ${getEffectivenessClass(effectiveness)}`}
                                                >
                                                    {getEffectivenessLabel(effectiveness)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="chart-legend">
                        <div className="legend-item">
                            <span className="legend-color super-effective"></span>
                            <span>2× Super Effective</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color neutral"></span>
                            <span>1× Normal</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color not-effective"></span>
                            <span>½× Not Very Effective</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color no-effect"></span>
                            <span>0× No Effect</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TypeChartPage;
