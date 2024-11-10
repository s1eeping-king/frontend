// src/utils/LevelManager.ts

export class LevelManager {
    private level: number;
    private staminaReward: number;

    constructor() {
        this.level = 1;
        this.staminaReward = 200; // 初始体力奖励
    }

    incrementLevel() {
        this.level += 1;
        this.staminaReward += 10; // 每关增加的体力奖励
    }

    getLevel() {
        return this.level;
    }

    getStaminaReward() {
        return this.staminaReward;
    }
}
