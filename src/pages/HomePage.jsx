import { useState, useMemo, useEffect } from 'react';
import { usePokemonList, useAllPokemon } from '../hooks/usePokemon';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import GenerationFilter, { GENERATIONS } from '../components/GenerationFilter';
import Loading from '../components/Loading';
import Error from '../components/Error';

function HomePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGen, setSelectedGen] = useState(0);

    const { pokemon, loading, error, totalPages, refetch } = usePokemonList(currentPage);
    const { allPokemon, loading: searchLoading } = useAllPokemon();

    // Reset page when generation changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGen]);

    // Get selected generation range
    const genRange = GENERATIONS.find(g => g.id === selectedGen)?.range || [1, 1025];

    // Filter Pokemon based on search term and generation
    const filteredPokemon = useMemo(() => {
        let filtered = [];

        // If searching or filtering by generation, use allPokemon
        if (searchTerm.trim() || selectedGen !== 0) {
            filtered = allPokemon.filter(p => {
                // Filter by generation
                const inGeneration = p.id >= genRange[0] && p.id <= genRange[1];

                // Filter by search term
                const matchesSearch = !searchTerm.trim() ||
                    p.name.toLowerCase().includes(searchTerm.toLowerCase().trim());

                return inGeneration && matchesSearch;
            });
        } else {
            filtered = pokemon;
        }

        return filtered;
    }, [searchTerm, pokemon, allPokemon, selectedGen, genRange]);

    // Paginate the filtered results when using generation filter
    const paginatedPokemon = useMemo(() => {
        if (selectedGen === 0 && !searchTerm.trim()) {
            return filteredPokemon;
        }

        const startIndex = (currentPage - 1) * 20;
        const endIndex = startIndex + 20;
        return filteredPokemon.slice(startIndex, endIndex);
    }, [filteredPokemon, currentPage, selectedGen, searchTerm]);

    // Calculate total pages for filtered results
    const calculatedTotalPages = useMemo(() => {
        if (selectedGen === 0 && !searchTerm.trim()) {
            return totalPages;
        }
        return Math.ceil(filteredPokemon.length / 20);
    }, [filteredPokemon, totalPages, selectedGen, searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleGenChange = (genId) => {
        setSelectedGen(genId);
        setSearchTerm(''); // Clear search when changing generation
    };

    const isSearching = searchTerm.trim().length > 0;
    const isFiltering = selectedGen !== 0;
    const showPagination = !isSearching && calculatedTotalPages > 1;

    return (
        <div className="container">
            {/* Hero Section */}
            <section className="hero">
                <h1 className="hero-title">
                    Explore the <span>Pokémon</span> World
                </h1>
                <p className="hero-subtitle">
                    Discover all your favorite Pokémon, their abilities, stats, and more in this comprehensive Pokédex explorer.
                </p>
                <SearchBar value={searchTerm} onChange={handleSearch} />
            </section>

            {/* Generation Filter */}
            <GenerationFilter
                selectedGen={selectedGen}
                onSelectGen={handleGenChange}
            />

            {/* Results Info */}
            {(isFiltering || isSearching) && filteredPokemon.length > 0 && (
                <div className="results-info">
                    Showing {paginatedPokemon.length} of {filteredPokemon.length} Pokémon
                    {isFiltering && ` in ${GENERATIONS.find(g => g.id === selectedGen)?.name}`}
                    {isSearching && ` matching "${searchTerm}"`}
                </div>
            )}

            {/* Pokemon Grid */}
            {loading && !isSearching && !isFiltering ? (
                <Loading message="Catching Pokémon..." />
            ) : searchLoading && (isSearching || isFiltering) ? (
                <Loading message="Loading Pokémon data..." />
            ) : error ? (
                <Error message={error} onRetry={refetch} />
            ) : paginatedPokemon.length === 0 ? (
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No Pokémon Found</h3>
                    <p>Try a different search term or generation</p>
                </div>
            ) : (
                <>
                    <div className="pokemon-grid">
                        {paginatedPokemon.map((poke) => (
                            <PokemonCard key={poke.id} pokemon={poke} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {showPagination && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={calculatedTotalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default HomePage;
