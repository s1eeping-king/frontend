// src/utils/GameStatus.ts

// 定义 GameStatus 接口，包含玩家的生命值、体力值和金币数量
export interface GameStatus {
    health: number;
    stamina: number;
    coins: number;
}

// 定义 PlayerStatus 类，用于管理和更新玩家的状态
export class PlayerStatus {
    private status: GameStatus;

    constructor() {
        // 初始化玩家状态，设置默认生命值、体力值和金币数量
        this.status = { health: 200, stamina: 200, coins: 0 };
    }

    // 更新生命值，确保不会低于 0
    updateHealth(amount: number) {
        this.status.health = Math.max(0, this.status.health + amount);
        if (this.status.health <= 0) {
            console.log("Game Over: No Health"); // 健康值耗尽时输出游戏结束信息
        }
    }

    // 更新体力值，确保不会低于 0
    updateStamina(amount: number) {
        this.status.stamina = Math.max(0, this.status.stamina + amount);
        if (this.status.stamina <= 0) {
            console.log("Game Over: No Stamina"); // 体力值耗尽时输出游戏结束信息
        }
    }

    // 增加金币数量
    addCoins(amount: number) {
        this.status.coins += amount;
    }

    // 获取当前的玩家状态
    getStatus() {
        return this.status;
    }
}
