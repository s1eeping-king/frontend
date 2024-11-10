// src/components/PlayerStatus.tsx
import React, { memo } from 'react';

interface PlayerStatusProps {
    health: number;
    stamina: number;
    coins: number;
}

const PlayerStatus: React.FC<PlayerStatusProps> = memo(({ health, stamina, coins }) => {
    const healthPercentage = Math.max(0, Math.min(200, health));
    const staminaPercentage = Math.max(0, Math.min(200, stamina));

    return (
        <div className="player-status">
            <div className="health-bar">
                <div className="health-bar-fill" style={{ width: `${healthPercentage}%` }}></div>
                <div className="health-text">{`Health: ${healthPercentage}%`}</div>
            </div>
            <div className="stamina-bar">
                <div className="stamina-bar-fill" style={{ width: `${staminaPercentage}%` }}></div>
                <div className="stamina-text">{`Stamina: ${staminaPercentage}%`}</div>
            </div>
            <div className="coins">Coins: {coins}</div>
        </div>
    );
});

export default PlayerStatus;
