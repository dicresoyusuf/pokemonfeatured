import { Link } from 'react-router-dom';

function PokemonCard({ pokemon }) {
    const { id, name, sprites, types } = pokemon;

    const formatId = (id) => {
        return `#${String(id).padStart(3, '0')}`;
    };

    const getImageUrl = () => {
        return sprites?.other?.['official-artwork']?.front_default
            || sprites?.other?.dream_world?.front_default
            || sprites?.front_default
            || '/placeholder.png';
    };

    return (
        <Link to={`/pokemon/${id}`} className="pokemon-card">
            <span className="pokemon-card-number">{formatId(id)}</span>
            <div className="pokemon-card-image-container">
                <div className="pokemon-card-image-bg"></div>
                <img
                    className="pokemon-card-image"
                    src={getImageUrl()}
                    alt={name}
                    loading="lazy"
                />
            </div>
            <h3 className="pokemon-card-name">{name}</h3>
            <div className="pokemon-card-types">
                {types.map(({ type }) => (
                    <span
                        key={type.name}
                        className={`type-badge type-${type.name}`}
                    >
                        {type.name}
                    </span>
                ))}
            </div>
        </Link>
    );
}

export default PokemonCard;
