/* eslint-disable import/max-dependencies */
import type AbilityManager from './abilities/ability-manager';
import type AccountManager from './players/account-manager';
import type AreaFactory from './locations/area-factory';
import type AreaManager from './locations/area-manager';
import type AttributeFactory from './attributes/attribute-factory';
import type BehaviorManager from './behaviors/behavior-manager';
import type ChannelManager from './communication/channels/channel-manager';
import type CharacterClassManager from './classes/character-class-manager';
import type CombatEngine from './combat/combat-engine';
import type CommandManager from './commands/command-manager';
import type Config from './util/config';
import type EntityLoaderRegistry from './data/entity-loader-registry';
import type EffectFactory from './effects/effect-factory';
import type HelpManager from './help/help-manager';
import type ItemFactory from './equipment/item-factory';
import type ItemManager from './equipment/item-manager';
import type MobFactory from './mobs/mob-factory';
import type MobManager from './mobs/mob-manager';
import type MudEventManager from './events/mud-event-manager';
import type PartyManager from './groups/party-manager';
import type PlayerManager from './players/player-manager';
import type QuestFactory from './quests/quest-factory';
import type QuestGoalManager from './quests/quest-goal-manager';
import type QuestRewardManager from './quests/quest-reward-manager';
import type RoomFactory from './locations/room-factory';
import type RoomManager from './locations/room-manager';
import type SimpleMap from './util/simple-map';
import type StreamEventManager from './events/stream-event-manager';

export interface GameStateData extends SimpleMap {
    accountManager: AccountManager;
    areaBehaviorManager: BehaviorManager;
    areaFactory: AreaFactory;
    areaManager: AreaManager;
    attributeFactory: AttributeFactory;
    channelManager: ChannelManager;
    combat: CombatEngine | null;
    commandManager: CommandManager;
    config: Config;
    effectFactory: EffectFactory;
    entityLoaderRegistry: EntityLoaderRegistry;
    helpManager: HelpManager;
    itemBehaviorManager: BehaviorManager;
    itemManager: ItemManager;
    itemFactory: ItemFactory;
    mobBehaviorManager: BehaviorManager;
    mobFactory: MobFactory;
    mobManager: MobManager;
    npcClassManager: CharacterClassManager;
    partyManager: PartyManager;
    playerClassManager: CharacterClassManager;
    playerManager: PlayerManager;
    questFactory: QuestFactory;
    questGoalManager: QuestGoalManager;
    questRewardManager: QuestRewardManager;
    roomBehaviorManager: BehaviorManager;
    roomFactory: RoomFactory;
    roomManager: RoomManager;
    serverEventManager: MudEventManager;
    skillManager: AbilityManager;
    spellManager: AbilityManager;
    streamEventManager: StreamEventManager;
}

export default GameStateData;
