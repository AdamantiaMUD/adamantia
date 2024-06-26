import type GameEntityDefinition from '../entities/game-entity-definition.js';

import type QuestGoalDefinition from './quest-goal-definition.js';
import type QuestRewardDefinition from './quest-reward-definition.js';

export interface QuestDefinition extends GameEntityDefinition {
    autoComplete: boolean;
    completionMessage?: string | null;
    description: string;
    entityReference?: string;
    goals: QuestGoalDefinition[];
    level?: number;
    npc?: string;
    repeatable: boolean;
    requires?: string[];
    rewards: QuestRewardDefinition[];
    title: string;
}

export default QuestDefinition;
