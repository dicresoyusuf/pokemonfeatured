import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'https://pokeapi.co/api/v2';
const POKEMON_PER_PAGE = 20;

export function usePokemonList(page = 1) {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const fetchPokemon = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const offset = (page - 1) * POKEMON_PER_PAGE;
            const response = await fetch(
                `${API_BASE}/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon list');
            }

            const data = await response.json();
            setTotalCount(data.count);

            // Fetch detailed info for each Pokemon
            const detailedPokemon = await Promise.all(
                data.results.map(async (poke) => {
                    const res = await fetch(poke.url);
                    if (!res.ok) throw new Error(`Failed to fetch ${poke.name}`);
                    return res.json();
                })
            );

            setPokemon(detailedPokemon);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPokemon();
    }, [fetchPokemon]);

    const totalPages = Math.ceil(totalCount / POKEMON_PER_PAGE);

    return { pokemon, loading, error, totalPages, refetch: fetchPokemon };
}

export function usePokemonDetail(id) {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPokemon = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/pokemon/${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon details');
            }

            const data = await response.json();
            setPokemon(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPokemon();
    }, [fetchPokemon]);

    return { pokemon, loading, error, refetch: fetchPokemon };
}

export function useAllPokemon() {
    const [allPokemon, setAllPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch all Pokemon (up to Gen 9 = 1025)
                const response = await fetch(`${API_BASE}/pokemon?limit=1025`);
                if (!response.ok) throw new Error('Failed to fetch Pokémon');
                const data = await response.json();

                // Fetch detailed data in batches to avoid overwhelming the API
                const batchSize = 50;
                const results = [];

                for (let i = 0; i < data.results.length; i += batchSize) {
                    const batch = data.results.slice(i, i + batchSize);
                    const batchData = await Promise.all(
                        batch.map(async (poke) => {
                            try {
                                const res = await fetch(poke.url);
                                return res.json();
                            } catch {
                                return null;
                            }
                        })
                    );
                    results.push(...batchData.filter(p => p !== null));

                    // Update state progressively for better UX
                    setAllPokemon([...results]);
                }

                setAllPokemon(results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return { allPokemon, loading, error };
}

export function useEvolutionChain(pokemonId) {
    const [evolutionChain, setEvolutionChain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvolutionChain = async () => {
            if (!pokemonId) return;

            setLoading(true);
            setError(null);

            try {
                // First, get the species data to find evolution chain URL
                const speciesResponse = await fetch(`${API_BASE}/pokemon-species/${pokemonId}`);
                if (!speciesResponse.ok) {
                    throw new Error('Failed to fetch species data');
                }
                const speciesData = await speciesResponse.json();

                // Fetch evolution chain
                const evolutionResponse = await fetch(speciesData.evolution_chain.url);
                if (!evolutionResponse.ok) {
                    throw new Error('Failed to fetch evolution chain');
                }
                const evolutionData = await evolutionResponse.json();

                // Parse the evolution chain
                const chain = [];
                let current = evolutionData.chain;

                const parseChain = async (chainData, stage = 1) => {
                    // Get Pokemon details for image
                    const pokemonName = chainData.species.name;
                    const pokemonResponse = await fetch(`${API_BASE}/pokemon/${pokemonName}`);
                    const pokemonData = await pokemonResponse.json();

                    // Get evolution details
                    const evolutionDetails = chainData.evolution_details[0] || null;

                    chain.push({
                        id: pokemonData.id,
                        name: pokemonName,
                        image: pokemonData.sprites?.other?.['official-artwork']?.front_default
                            || pokemonData.sprites?.front_default,
                        types: pokemonData.types,
                        stage,
                        minLevel: evolutionDetails?.min_level || null,
                        trigger: evolutionDetails?.trigger?.name || null,
                        item: evolutionDetails?.item?.name || null,
                    });

                    // Process evolutions (can have multiple)
                    for (const evolution of chainData.evolves_to) {
                        await parseChain(evolution, stage + 1);
                    }
                };

                await parseChain(current);
                setEvolutionChain(chain);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvolutionChain();
    }, [pokemonId]);

    return { evolutionChain, loading, error };
}

// Hook for fetching Pokemon abilities with descriptions
export function useAbilities(pokemon) {
    const [abilities, setAbilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAbilities = async () => {
            if (!pokemon?.abilities) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const abilitiesData = await Promise.all(
                    pokemon.abilities.map(async (abilityInfo) => {
                        const response = await fetch(abilityInfo.ability.url);
                        if (!response.ok) throw new Error('Failed to fetch ability');
                        const data = await response.json();

                        // Get English effect text
                        const effectEntry = data.effect_entries.find(
                            entry => entry.language.name === 'en'
                        );

                        // Get English flavor text
                        const flavorEntry = data.flavor_text_entries.find(
                            entry => entry.language.name === 'en'
                        );

                        return {
                            name: data.name,
                            isHidden: abilityInfo.is_hidden,
                            effect: effectEntry?.short_effect || effectEntry?.effect || 'No description available.',
                            flavorText: flavorEntry?.flavor_text || null,
                        };
                    })
                );

                setAbilities(abilitiesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAbilities();
    }, [pokemon]);

    return { abilities, loading, error };
}

// Hook for fetching Pokemon species info
export function useSpecies(pokemonId) {
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSpecies = async () => {
            if (!pokemonId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE}/pokemon-species/${pokemonId}`);
                if (!response.ok) throw new Error('Failed to fetch species data');
                const data = await response.json();

                // Get English flavor text (latest version)
                const flavorTexts = data.flavor_text_entries
                    .filter(entry => entry.language.name === 'en')
                    .reverse();
                const flavorText = flavorTexts[0]?.flavor_text?.replace(/\f/g, ' ').replace(/\n/g, ' ') || null;

                // Get English genus
                const genusEntry = data.genera.find(g => g.language.name === 'en');

                // Calculate gender ratio
                let genderRatio = null;
                if (data.gender_rate !== -1) {
                    const femalePercent = (data.gender_rate / 8) * 100;
                    const malePercent = 100 - femalePercent;
                    genderRatio = { male: malePercent, female: femalePercent };
                }

                setSpecies({
                    flavorText,
                    genus: genusEntry?.genus || null,
                    habitat: data.habitat?.name || null,
                    color: data.color?.name || null,
                    shape: data.shape?.name || null,
                    captureRate: data.capture_rate,
                    baseHappiness: data.base_happiness,
                    genderRatio,
                    isLegendary: data.is_legendary,
                    isMythical: data.is_mythical,
                    eggGroups: data.egg_groups.map(g => g.name),
                    growthRate: data.growth_rate?.name || null,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecies();
    }, [pokemonId]);

    return { species, loading, error };
}

// Hook for fetching Pokemon moves
export function useMoves(pokemon, limit = 10) {
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMoves = async () => {
            if (!pokemon?.moves) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Get only the first 'limit' moves to avoid too many API calls
                const movesToFetch = pokemon.moves.slice(0, limit);

                const movesData = await Promise.all(
                    movesToFetch.map(async (moveInfo) => {
                        const response = await fetch(moveInfo.move.url);
                        if (!response.ok) throw new Error('Failed to fetch move');
                        const data = await response.json();

                        return {
                            name: data.name,
                            type: data.type.name,
                            power: data.power,
                            accuracy: data.accuracy,
                            pp: data.pp,
                            damageClass: data.damage_class?.name || null,
                            learnMethod: moveInfo.version_group_details[0]?.move_learn_method?.name || null,
                            levelLearned: moveInfo.version_group_details[0]?.level_learned_at || null,
                        };
                    })
                );

                // Sort moves by level learned
                movesData.sort((a, b) => (a.levelLearned || 0) - (b.levelLearned || 0));
                setMoves(movesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMoves();
    }, [pokemon, limit]);

    return { moves, loading, error };
}

// Hook for fetching Pokemon encounter locations
export function useEncounters(pokemonId) {
    const [encounters, setEncounters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEncounters = async () => {
            if (!pokemonId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE}/pokemon/${pokemonId}/encounters`);
                if (!response.ok) throw new Error('Failed to fetch encounters');
                const data = await response.json();

                const encountersData = data.slice(0, 10).map(encounter => ({
                    locationName: encounter.location_area.name.replace(/-/g, ' '),
                    versions: encounter.version_details.map(v => v.version.name),
                    maxChance: Math.max(...encounter.version_details.map(v => v.max_chance)),
                }));

                setEncounters(encountersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEncounters();
    }, [pokemonId]);

    return { encounters, loading, error };
}

// Hook for fetching all types for Type Chart
export function useTypes() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTypes = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE}/type`);
                if (!response.ok) throw new Error('Failed to fetch types');
                const data = await response.json();

                // Filter out special types (unknown, shadow)
                const mainTypes = data.results.filter(
                    t => !['unknown', 'shadow'].includes(t.name)
                );

                // Fetch detailed info for each type
                const typesData = await Promise.all(
                    mainTypes.map(async (type) => {
                        const res = await fetch(type.url);
                        const typeData = await res.json();

                        return {
                            id: typeData.id,
                            name: typeData.name,
                            damageRelations: {
                                doubleDamageTo: typeData.damage_relations.double_damage_to.map(t => t.name),
                                halfDamageTo: typeData.damage_relations.half_damage_to.map(t => t.name),
                                noDamageTo: typeData.damage_relations.no_damage_to.map(t => t.name),
                                doubleDamageFrom: typeData.damage_relations.double_damage_from.map(t => t.name),
                                halfDamageFrom: typeData.damage_relations.half_damage_from.map(t => t.name),
                                noDamageFrom: typeData.damage_relations.no_damage_from.map(t => t.name),
                            }
                        };
                    })
                );

                setTypes(typesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTypes();
    }, []);

    return { types, loading, error };
}
