const GENERATIONS = [
    { id: 0, name: 'All', range: [1, 1025] },
    { id: 1, name: 'Gen I', range: [1, 151], region: 'Kanto' },
    { id: 2, name: 'Gen II', range: [152, 251], region: 'Johto' },
    { id: 3, name: 'Gen III', range: [252, 386], region: 'Hoenn' },
    { id: 4, name: 'Gen IV', range: [387, 493], region: 'Sinnoh' },
    { id: 5, name: 'Gen V', range: [494, 649], region: 'Unova' },
    { id: 6, name: 'Gen VI', range: [650, 721], region: 'Kalos' },
    { id: 7, name: 'Gen VII', range: [722, 809], region: 'Alola' },
    { id: 8, name: 'Gen VIII', range: [810, 905], region: 'Galar' },
    { id: 9, name: 'Gen IX', range: [906, 1025], region: 'Paldea' },
];

function GenerationFilter({ selectedGen, onSelectGen }) {
    return (
        <div className="generation-filter">
            <div className="gen-buttons">
                {GENERATIONS.map(gen => (
                    <button
                        key={gen.id}
                        className={`gen-btn ${selectedGen === gen.id ? 'active' : ''}`}
                        onClick={() => onSelectGen(gen.id)}
                        title={gen.region || 'All Regions'}
                    >
                        <span className="gen-name">{gen.name}</span>
                        {gen.region && (
                            <span className="gen-region">{gen.region}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export { GENERATIONS };
export default GenerationFilter;
