// src/components/Controls.tsx
import React, { useEffect, memo } from 'react';

interface ControlsProps {
    onMove: (direction: string) => void;
    onStart: () => void;
    onHint: () => void;
    stamina: number;
    level: number;
}

const Controls: React.FC<ControlsProps> = memo(({ onMove, onStart, onHint, stamina, level }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    onMove('up');
                    break;
                case 'ArrowDown':
                    onMove('down');
                    break;
                case 'ArrowLeft':
                    onMove('left');
                    break;
                case 'ArrowRight':
                    onMove('right');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onMove]);

    return (
        <div className="controls">
            <div className="game-info">
                <p>Levels：{level}</p>
                <p>stamina：{stamina}</p>
            </div>
            <button className="start-button" onClick={onStart}>Game Start</button>
        </div>
    );
});

export default Controls;
