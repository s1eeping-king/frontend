// src/utils/RankingSystem.ts

export interface PlayerScore {
    playerId: string;
    score: number;
}

export class RankingSystem {
    private rankings: PlayerScore[];

    constructor() {
        this.rankings = this.loadRankings();
    }

    // 添加玩家分数
    addPlayerScore(playerId: string, score: number) {
        const existingPlayer = this.rankings.find(player => player.playerId === playerId);
        if (existingPlayer) {
            existingPlayer.score = Math.max(existingPlayer.score, score); // 保留最高分
        } else {
            this.rankings.push({ playerId, score });
        }
        this.rankings.sort((a, b) => b.score - a.score);
        this.saveRankings();
    }

    // 获取排行榜
    getRankings() {
        return this.rankings.slice(0, 10); // 获取前10名
    }

    // 清除排行榜
    resetRankings() {
        this.rankings = [];
        this.saveRankings();
    }

    // 持久化排行榜数据
    private saveRankings() {
        localStorage.setItem('rankings', JSON.stringify(this.rankings));
    }

    // 从本地加载排行榜数据
    private loadRankings(): PlayerScore[] {
        const savedRankings = localStorage.getItem('rankings');
        return savedRankings ? JSON.parse(savedRankings) : [];
    }
}
