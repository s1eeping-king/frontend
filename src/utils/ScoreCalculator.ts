// src/utils/ScoreCalculator.ts

// 计算最终得分的函数
export function calculateScore(
    coins: number,
    health: number,
    stamina: number,
    level: number
): number {
    // 根据金币、生命值、体力值和关卡数计算最终得分
    const score = coins * 10 + health * 5 + stamina * 2 + level * 100;
    return score;
}
