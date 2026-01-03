import { useMoves } from '../hooks/usePokemon';

function MovesList({ pokemon }) {
    const { moves, loading, error } = useMoves(pokemon, 15);

    if (loading) {
        return (
            <section className="moves-section">
                <h2 className="section-title">Moves</h2>
                <div className="moves-loading">
                    <div className="move-skeleton"></div>
                    <div className="move-skeleton"></div>
                    <div className="move-skeleton"></div>
                </div>
            </section>
        );
    }

    if (error || moves.length === 0) {
        return null;
    }

    const getDamageClassIcon = (damageClass) => {
        switch (damageClass) {
            case 'physical': return '💥';
            case 'special': return '✨';
            case 'status': return '🔄';
            default: return '❓';
        }
    };

    return (
        <section className="moves-section">
            <h2 className="section-title">Moves</h2>

            <div className="moves-table-container">
                <table className="moves-table">
                    <thead>
                        <tr>
                            <th>Move</th>
                            <th>Type</th>
                            <th>Cat.</th>
                            <th>Power</th>
                            <th>Acc.</th>
                            <th>PP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moves.map((move, index) => (
                            <tr key={`${move.name}-${index}`}>
                                <td className="move-name">
                                    {move.name.replace(/-/g, ' ')}
                                </td>
                                <td>
                                    <span className={`type-badge small type-${move.type}`}>
                                        {move.type}
                                    </span>
                                </td>
                                <td className="move-category" title={move.damageClass}>
                                    {getDamageClassIcon(move.damageClass)}
                                </td>
                                <td className="move-power">
                                    {move.power || '—'}
                                </td>
                                <td className="move-accuracy">
                                    {move.accuracy ? `${move.accuracy}%` : '—'}
                                </td>
                                <td className="move-pp">
                                    {move.pp || '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="moves-note">
                Showing {moves.length} of {pokemon.moves?.length || 0} moves
            </p>
        </section>
    );
}

export default MovesList;
