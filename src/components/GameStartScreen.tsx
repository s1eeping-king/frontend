// src/components/GameStartScreen.tsx

import React from 'react';

interface GameStartScreenProps {
    onStart: () => void;
}

const GameStartScreen: React.FC<GameStartScreenProps> = ({ onStart }) => {
    return (
        <div className="game-start-screen">
            <h1>Maze Game</h1>
            <p>Welcome! Avoid traps, collect coins, and reach the treasure.</p>
            <button onClick={onStart}>Start Game</button>
        </div>
    );
};

export default GameStartScreen;
