import type GameStateData from '../../../../lib/game-state-data.js';
import { PlayerCurrencyGainedEvent } from '../../../../lib/players/events/index.js';
import type Player from '../../../../lib/players/player.js';
import type QuestReward from '../../../../lib/quests/quest-reward.js';
import type Quest from '../../../../lib/quests/quest.js';
import type SimpleMap from '../../../../lib/util/simple-map.js';

interface CurrencyRewardConfig extends SimpleMap {
    currency: string;
    amount: number;
}

/**
 * Quest reward that gives experience
 *
 * Config options:
 *   currency: string, required, currency to award
 *   amount: number, required
 */
export class CurrencyReward implements QuestReward<CurrencyRewardConfig> {
    public display(
        state: GameStateData,
        quest: Quest,
        player: Player,
        config: CurrencyRewardConfig
    ): string {
        const { amount } = config;
        const friendlyName = config.currency
            .replace('_', ' ')
            .replace(/\b\w/gu, (str: string) => str.toUpperCase());

        return `Currency: {bold ${amount}} x {white.bold [${friendlyName}]}`;
    }

    public reward(
        state: GameStateData,
        quest: Quest,
        player: Player,
        config: CurrencyRewardConfig
    ): void {
        const { amount } = config;

        player.dispatch(
            new PlayerCurrencyGainedEvent({
                amount: amount,
                denomination: config.currency,
            })
        );
    }
}

export default CurrencyReward;
