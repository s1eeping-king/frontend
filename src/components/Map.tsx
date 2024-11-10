// src/components/Map.tsx
import React, { memo, Suspense } from 'react';
import Man from '../src/ast/Man.js';
import { WALL, TRAP, CHEST, TREASURE, PATH } from '../App';

const Path = React.lazy(() => import('../src/ast/Path.js'));
const Wall = React.lazy(() => import('../src/ast/Wall.js'));
const Trap = React.lazy(() => import('../src/ast/Trap.js'));
const Chest = React.lazy(() => import('../src/ast/Chest.js'));
const Treasure = React.lazy(() => import('../src/ast/Treasure.js'));

interface MapProps {
    mapData: number[][];
    playerPosition: { x: number; y: number };
}

const getMapCellComponent = (cellType: number) => {
    switch (cellType) {
        case WALL:
            return <Wall />;
        case TRAP:
            return <Trap />;
        case CHEST:
            return <Chest />;
        case TREASURE:
            return <Treasure />;
        case PATH:
        default:
            return <Path />;
    }
};

const Map: React.FC<MapProps> = memo(({ mapData, playerPosition }) => {
    return (
        <div className="map">
            {mapData.map((row, rowIndex) => (
                <div key={rowIndex} className="map-row">
                    {row.map((cell, colIndex) => {
                        const isPlayerHere = playerPosition.x === rowIndex && playerPosition.y === colIndex;

                        return (
                            <span
                                key={colIndex}
                                className={`map-cell ${isPlayerHere ? "player" : ""}`}
                                style={{ backgroundColor: 'transparent' }}
                            >
                                {isPlayerHere ? (
                                    <Man />
                                ) : (
                                    <Suspense fallback={<span className="loading-placeholder" />}>
                                        {getMapCellComponent(cell)}
                                    </Suspense>
                                )}
                            </span>
                        );
                    })}
                </div>
            ))}
        </div>
    );
});

export default Map;
