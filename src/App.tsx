// src/App.tsx

import React, { useState, useEffect, Suspense } from 'react';
import './styles.css';
import mainImage from '../src/assets/main.jpg';
// 导入工具模块
import { GameStatus } from './utils/GameStatus';
import { LevelManager } from './utils/LevelManager';
import { RankingSystem } from './utils/RankingSystem';
import { calculateScore } from './utils/ScoreCalculator';
import RankingBoard from './components/RankingBoard';

// 懒加载组件以优化性能
const Map = React.lazy(() => import('./components/Map'));
const PlayerStatus = React.lazy(() => import('./components/PlayerStatus'));
const Controls = React.lazy(() => import('./components/Controls'));
const EventLog = React.lazy(() => import('./components/EventLog'));
const GameEndScreen = React.lazy(() => import('./components/GameEndModal'));

export interface Position {
    x: number;
    y: number;
}

export interface PlayerData {
    health: number;
    stamina: number;
    coins: number;
    position: Position;
    eventMessage?: string;
}

// 地图元素常量
export const PATH = 0;
export const WALL = 1;
export const TRAP = 2;
export const CHEST = 3;
export const TREASURE = 4;

const initialStamina = 200;
const staminaConsumption = 0.5;

// 生成迷宫并确保路径可达
const generateMazeWithPaths = (width: number, height: number, level: number): number[][] => {
    const map = Array.from({ length: height }, () => Array(width).fill(WALL));
    const treasureX = height - 2;
    const treasureY = width - 2;

    const createMazePath = (x: number, y: number) => {
        map[x][y] = PATH;
        const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        directions.sort(() => Math.random() - 0.5);
        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (nx > 0 && ny > 0 && nx < height - 1 && ny < width - 1 && map[nx][ny] === WALL) {
                map[x + dx][y + dy] = PATH;
                createMazePath(nx, ny);
            }
        }
    };

    createMazePath(1, 1);
    map[treasureX][treasureY] = PATH;
    map[treasureX][treasureY - 1] = PATH;
    map[treasureX][treasureY + 1] = TREASURE;

    const availablePathCells: Position[] = [];
    for (let i = 1; i < height - 1; i++) {
        for (let j = 1; j < width - 1; j++) {
            if (map[i][j] === PATH) {
                availablePathCells.push({ x: i, y: j });
            }
        }
    }

    const maxTraps = Math.min(5 + level, 15);
    const maxChests = Math.min(3 + level, 10);
    let trapCount = 0;
    let chestCount = 0;

    while ((trapCount < maxTraps || chestCount < maxChests) && availablePathCells.length > 0) {
        const index = Math.floor(Math.random() * availablePathCells.length);
        const cell = availablePathCells.splice(index, 1)[0];

        if (trapCount < maxTraps && Math.random() < 0.5) {
            map[cell.x][cell.y] = TRAP;
            trapCount++;
        } else if (chestCount < maxChests) {
            map[cell.x][cell.y] = CHEST;
            chestCount++;
        }
    }

    return map;
};

const App: React.FC = () => {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
    const [level, setLevel] = useState(1);
    const [mapData, setMapData] = useState<number[][]>(generateMazeWithPaths(18, 36, level));
    const [playerData, setPlayerData] = useState<PlayerData>({
        health: 200,
        stamina: initialStamina,
        coins: 0,
        position: { x: 1, y: 1 },
    });
    const [eventLog, setEventLog] = useState<string[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const preloadAssets = async () => {
            const image = new Image();
            image.src = mainImage;
            await new Promise<void>((resolve) => {
                image.onload = () => resolve();
            });
            setIsAssetsLoaded(true);
        };

        preloadAssets();
    }, []);

    const startGame = () => {
        setIsGameStarted(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        let newPosition = { ...playerData.position };
        if (playerData.stamina <= 0) {
            setEventLog([...eventLog, "Not enough physical strength to move！"]);
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                newPosition.y = Math.max(newPosition.y - 1, 0); // 上移，减少y轴
                break;
            case 'ArrowDown':
                newPosition.y = Math.min(newPosition.y + 1, mapData.length - 1); // 下移，增加y轴
                break;
            case 'ArrowLeft':
                newPosition.x = Math.max(0, newPosition.x - 1); // 左移，减少x轴
                break;
            case 'ArrowRight':
                newPosition.x = Math.min(mapData[0].length - 1, newPosition.x + 1); // 右移，增加x轴
                break;
            default:
                return;
        }

        if (mapData[newPosition.x][newPosition.y] === WALL) {
            setEventLog([...eventLog, "Hit the wall, can't move！"]);
        } else {
            let newHealth = playerData.health;
            let newCoins = playerData.coins;
            let newStamina = playerData.stamina - staminaConsumption;
            let message = "Mobile success";

            if (mapData[newPosition.x][newPosition.y] === TRAP) {
                newHealth -= 20;
                mapData[newPosition.x][newPosition.y] = PATH;
                message = "Step on a trap, health will decrease！";
            } else if (mapData[newPosition.x][newPosition.y] === CHEST) {
                newCoins += 10;
                mapData[newPosition.x][newPosition.y] = PATH;
                message = "Pick up treasure chests and increase gold coins！";
            } else if (mapData[newPosition.x][newPosition.y] === TREASURE) {
                setEventLog([...eventLog, "Arrival at the destination！"]);
                setIsGameOver(true);
            }

            setPlayerData({
                health: newHealth,
                stamina: newStamina,
                coins: newCoins,
                position: newPosition,
            });

            setEventLog([...eventLog, message]);

            if (newHealth <= 0 || newStamina <= 0) {
                setIsGameOver(true);
                setEventLog([...eventLog, "game over！"]);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [playerData, mapData, eventLog]);

    const handleStart = () => {
        setMapData(generateMazeWithPaths(18, 36, level));
        setPlayerData({
            health: 200,
            stamina: initialStamina,
            coins: 0,
            position: { x: 1, y: 1 },
        });
        setEventLog(["Game Started"]);
        setIsGameOver(false);
    };

    const finalScore = calculateScore(playerData.coins, playerData.health, playerData.stamina, level);

    return (
        <div className="game-container-horizontal">
            {isGameStarted ? (
                isGameOver ? (
                    <Suspense fallback={<div>loading...</div>}>
                        <GameEndScreen score={finalScore} onRestart={handleStart} />
                    </Suspense>
                ) : (
                    <Suspense fallback={<div>loading...</div>}>
                        <>
                            <div className="left-panel">
                                <PlayerStatus health={playerData.health} stamina={playerData.stamina} coins={playerData.coins} />
                                <Map mapData={mapData} playerPosition={playerData.position} />
                            </div>
                            <div className="right-panel">
                                <Controls
                                    onMove={() => {}}
                                    onStart={handleStart}
                                    onHint={() => { /* 提示的逻辑处理 */ }}
                                    stamina={playerData.stamina}
                                    level={level}
                                />
                                <EventLog events={eventLog} />
                                <button className="submit-score-button" onClick={() => alert(`Final score：${finalScore}`)}>
                                    Submit Score
                                </button>
                                <button className="purchase-button" onClick={() => {
                                    if (playerData.coins >= 5) {
                                        setPlayerData(prev => ({
                                            ...prev,
                                            stamina: prev.stamina + 20,
                                            coins: prev.coins - 5,
                                        }));
                                    } else {
                                        setEventLog([...eventLog, "Not enough gold coins to buy"]);
                                    }
                                }}>
                                    Buy Stamina Potion (+20)
                                </button>
                                <button className="purchase-button" onClick={() => {
                                    if (playerData.coins >= 10) {
                                        setPlayerData(prev => ({
                                            ...prev,
                                            health: prev.health + 20,
                                            coins: prev.coins - 10,
                                        }));
                                    } else {
                                        setEventLog([...eventLog, "Not enough gold coins to buy"]);
                                    }
                                }}>
                                    Buy Health Potion (+20)
                                </button>
                            </div>
                            <div className="app">
                                <h1>Game Rankings</h1>
                                <RankingBoard />
                            </div>
                        </>
                    </Suspense>
                )
            ) : (
                <div className="start-screen" onClick={startGame} style={{ cursor: 'pointer' }}>
                    <img src={mainImage} alt="Main" className="main-image" />
                    <div className="start-overlay">
                        {isAssetsLoaded ? "Click to Start Game " : "Loading..."}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
