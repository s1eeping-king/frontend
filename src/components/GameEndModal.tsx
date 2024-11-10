// src/components/GameEndScreen.tsx

import React from 'react';

interface GameEndScreenProps {
    score: number;
    onRestart: () => void;
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({ score, onRestart }) => {
    return (
        <div className="game-end-screen">
            <h2>Game Over</h2>
            <p>Final Score: {score}</p>
            <button onClick={onRestart}>Restart</button>
        </div>
    );
};

export default GameEndScreen;
