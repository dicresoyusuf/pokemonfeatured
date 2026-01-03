import { useEffect, useState } from 'react';

const STAT_NAMES = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
};

function StatBar({ stat }) {
    const [width, setWidth] = useState(0);
    const maxStat = 255;
    const percentage = (stat.base_stat / maxStat) * 100;

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth(percentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="stat-row">
            <span className="stat-name">{STAT_NAMES[stat.stat.name] || stat.stat.name}</span>
            <span className="stat-value">{stat.base_stat}</span>
            <div className="stat-bar-container">
                <div
                    className="stat-bar"
                    style={{ width: `${width}%` }}
                ></div>
            </div>
        </div>
    );
}

export default StatBar;
