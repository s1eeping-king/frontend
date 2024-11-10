// src/components/RankingBoard.tsx
import React, { useEffect, useState } from 'react';
import { RankingSystem, PlayerScore } from '../utils/RankingSystem';

const rankingSystem = new RankingSystem();

const RankingBoard: React.FC = () => {
    const [rankings, setRankings] = useState<PlayerScore[]>([]);

    useEffect(() => {
        // 加载排行榜数据
        setRankings(rankingSystem.getRankings());
    }, []);

    return (
        <div className="ranking-board">
            <h2>Rankings</h2>
            <ol>
                {rankings.map((player, index) => (
                    <li key={player.playerId}>
                        {index + 1}. {player.playerId} - Score: {player.score}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default RankingBoard;
