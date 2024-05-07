/* eslint-disable import/max-dependencies */

// root
export { BundleManager } from './bundle-manager.js';
export { GameServer } from './game-server.js';
export { GameState } from './game-state.js';
export type { GameStateData } from './game-state-data.js';

// abilities
export * as AbilityErrors from './abilities/errors/index.js';
export * as AbilityEvents from './abilities/events/index.js';
export { Ability } from './abilities/ability.js';
export type { AbilityDefinition } from './abilities/ability-definition.js';
export { AbilityFlag } from './abilities/ability-flag.js';
export { AbilityManager } from './abilities/ability-manager.js';
export type { AbilityResource } from './abilities/ability-resource.js';
export type { AbilityRunner } from './abilities/ability-runner.js';
export { AbilityType } from './abilities/ability-type.js';

// attributes
export { Attribute } from './attributes/attribute.js';
export type { AttributeDefinition } from './attributes/attribute-definition.js';
export { AttributeFactory } from './attributes/attribute-factory.js';
export { AttributeFormula } from './attributes/attribute-formula.js';
export type { AttributeFormulaDefinition } from './attributes/attribute-formula-definition.js';
export { CharacterAttributes } from './attributes/character-attributes.js';

// behaviors
export type { Behavior } from './behaviors/behavior.js';
export type { BehaviorDefinition } from './behaviors/behavior-definition.js';
export type { BehaviorEventListenerDefinition } from './behaviors/behavior-event-listener-definition.js';
export type { BehaviorEventListenerFactory } from './behaviors/behavior-event-listener-factory.js';
export { BehaviorManager } from './behaviors/behavior-manager.js';

// characters
export * as CharacterEvents from './characters/events/index.js';
export { Character } from './characters/character.js';

// classes
export type { CharacterClass } from './classes/character-class.js';
export { CharacterClassManager } from './classes/character-class-manager.js';
export type { NpcClass } from './classes/npc-class.js';
export type { PlayerClass } from './classes/player-class.js';

// combat
export * as CombatErrors from './combat/errors/index.js';
export * as CombatEvents from './combat/events/index.js';
export { CharacterCombat } from './combat/character-combat.js';
export { CombatEngine } from './combat/combat-engine.js';
export { Damage } from './combat/damage.js';
export { Heal } from './combat/heal.js';
export { LootTable } from './combat/loot-table.js';

// commands
export * as CommandErrors from './commands/errors/index.js';
export { ArgParser } from './commands/arg-parser.js';
export { Command } from './commands/command.js';
export type { CommandDefinition } from './commands/command-definition.js';
export type { CommandDefinitionBuilder } from './commands/command-definition-builder.js';
export type { CommandDefinitionFactory } from './commands/command-definition-factory.js';
export type { CommandExecutable } from './commands/command-executable.js';
export { CommandManager } from './commands/command-manager.js';
export { CommandParser } from './commands/command-parser.js';
export { CommandQueue } from './commands/command-queue.js';
export { CommandType } from './commands/command-type.js';
export type { ParsedCommand } from './commands/parsed-command.js';

// common
export * as CommonEvents from './common/events/index.js';
export type { LogMessage } from './common/log-message.js';
export { Logger } from './common/logger.js';

// communication - audiences
export { AreaAudience } from './communication/audiences/area-audience.js';
export { ChannelAudience } from './communication/audiences/channel-audience.js';
export { PartyAudience } from './communication/audiences/party-audience.js';
export { PrivateAudience } from './communication/audiences/private-audience.js';
export { RoleAudience } from './communication/audiences/role-audience.js';
export { RoomAudience } from './communication/audiences/room-audience.js';
export { WorldAudience } from './communication/audiences/world-audience.js';

// communication - channels
export * as ChannelErrors from './communication/channels/errors/index.js';
export * as ChannelEvents from './communication/channels/events/index.js';
export { Channel } from './communication/channels/channel.js';
export type { ChannelDefinition } from './communication/channels/channel-definition.js';
export { ChannelManager } from './communication/channels/channel-manager.js';
export type { ChannelMessageFormatter } from './communication/channels/channel-message-formatter.js';

// communication - core
export * as Broadcast from './communication/broadcast.js';
export * as CommunicationEvents from './communication/events/index.js';
export type { AdamantiaSocket } from './communication/adamantia-socket.js';
export type { Broadcastable } from './communication/broadcastable.js';
export type { Colorizer } from './communication/colorizer.js';
export type { MessageFormatter } from './communication/message-formatter.js';
export type { PromptDefinition } from './communication/prompt-definition.js';
export { TransportStream } from './communication/transport-stream.js';

// data - core
export * as DataEvents from './data/events/index.js';
export { AreaEntitiesLoader } from './data/area-entities-loader.js';
export { BundleAreasLoader } from './data/bundle-areas-loader.js';
export type { Metadatable } from './data/metadatable.js';
export type { Serializable } from './data/serializable.js';

// effects
export * as EffectEvents from './effects/events/index.js';
export * as EffectModifiers from './effects/modifiers/index.js';
export { Effect } from './effects/effect.js';
export type { EffectConfig } from './effects/effect-config.js';
export type { EffectDefinition } from './effects/effect-definition.js';
export { EffectFactory } from './effects/effect-factory.js';
export { EffectFlag } from './effects/effect-flag.js';
export type { EffectInfo } from './effects/effect-info.js';
export { EffectList } from './effects/effect-list.js';
export type { EffectListenersDefinition } from './effects/effect-listeners-definition.js';
export type { EffectListenersDefinitionFactory } from './effects/effect-listeners-definition-factory.js';
export type { EffectState } from './effects/effect-state.js';
export type { SerializedEffect } from './effects/serialized-effect.js';

// entities
export { EntityFactory } from './entities/entity-factory.js';
export { GameEntity } from './entities/game-entity.js';
export type { GameEntityDefinition } from './entities/game-entity-definition.js';
export type { Scriptable } from './entities/scriptable.js';
export { ScriptableEntity } from './entities/scriptable-entity.js';
export type { ScriptableEntityDefinition } from './entities/scriptable-entity-definition.js';
export type { SerializedGameEntity } from './entities/serialized-game-entity.js';
export type { SerializedScriptableEntity } from './entities/serialized-scriptable-entity.js';

// equipment
export * as EquipmentErrors from './equipment/errors/index.js';
export * as EquipmentEvents from './equipment/events/index.js';
export { Inventory } from './equipment/inventory.js';
export { Item } from './equipment/item.js';
export type { ItemDefinition } from './equipment/item-definition.js';
export { ItemFactory } from './equipment/item-factory.js';
export { ItemManager } from './equipment/item-manager.js';
export { ItemQuality } from './equipment/item-quality.js';
export type { ItemStats } from './equipment/item-stats.js';
export { ItemType } from './equipment/item-type.js';
export type { SerializedInventory } from './equipment/serialized-inventory.js';
export type { SerializedItem } from './equipment/serialized-item.js';

// events
export type { InputMenuOption } from './events/input-menu-option.js';
export { MudEvent } from './events/mud-event.js';
export { MudEventEmitter } from './events/mud-event-emitter.js';
export type { MudEventListener } from './events/mud-event-listener.js';
export type { MudEventListenerDefinition } from './events/mud-event-listener-definition.js';
export type { MudEventListenerFactory } from './events/mud-event-listener-factory.js';
export { MudEventManager } from './events/mud-event-manager.js';
export type { PlayerEventListener } from './events/player-event-listener.js';
export type { PlayerEventListenerDefinition } from './events/player-event-listener-definition.js';
export { StreamEvent } from './events/stream-event.js';
export type { StreamEventListener } from './events/stream-event-listener.js';
export type { StreamEventListenerFactory } from './events/stream-event-listener-factory.js';
export { StreamEventManager } from './events/stream-event-manager.js';

// game-server
export * as GameServerEvents from './game-server/events/index.js';

// groups
export { Party } from './groups/party.js';
export { PartyManager } from './groups/party-manager.js';

// help
export { HelpManager } from './help/help-manager.js';
export { Helpfile } from './help/helpfile.js';
export type { HelpfileOptions } from './help/helpfile-options.js';

// locations
export * as LocationEvents from './locations/events/index.js';
export { Area } from './locations/area.js';
export type { AreaDefinition } from './locations/area-definition.js';
export { AreaFactory } from './locations/area-factory.js';
export { AreaManager } from './locations/area-manager.js';
export type { AreaManifest } from './locations/area-manifest.js';
export { Direction } from './locations/direction.js';
export type { Door } from './locations/door.js';
export { Room } from './locations/room.js';
export type {
    AugmentedRoomDefinition,
    RoomDefinition,
} from './locations/room-definition.js';
export type { RoomEntityDefinition } from './locations/room-entity-definition.js';
export type {
    AugmentedRoomExitDefinition,
    RoomExitDefinition,
} from './locations/room-exit-definition.js';
export { RoomFactory } from './locations/room-factory.js';
export { RoomManager } from './locations/room-manager.js';

// mobs
export * as MobEvents from './mobs/events/index.js';
export { MobFactory } from './mobs/mob-factory.js';
export { MobManager } from './mobs/mob-manager.js';
export { Npc } from './mobs/npc.js';
export type { NpcDefinition } from './mobs/npc-definition.js';

// players
export * as PlayerEvents from './players/events/index.js';
export { Account } from './players/account.js';
export { AccountManager } from './players/account-manager.js';
export { Player } from './players/player.js';
export { PlayerManager } from './players/player-manager.js';
export { PlayerRole } from './players/player-role.js';
export type { SerializedPlayer } from './players/serialized-player.js';

// quests
export * as QuestEvents from './quests/events/index.js';
export type { AbstractQuest } from './quests/abstract-quest.js';
export { Quest } from './quests/quest.js';
export type { QuestDefinition } from './quests/quest-definition.js';
export { QuestFactory } from './quests/quest-factory.js';
export { QuestGoal } from './quests/quest-goal.js';
export type { QuestGoalDefinition } from './quests/quest-goal-definition.js';
export { QuestGoalManager } from './quests/quest-goal-manager.js';
export type { QuestProgress } from './quests/quest-progress.js';
export type { QuestReward } from './quests/quest-reward.js';
export type { QuestRewardDefinition } from './quests/quest-reward-definition.js';
export { QuestRewardManager } from './quests/quest-reward-manager.js';
export { QuestTracker } from './quests/quest-tracker.js';
export type { SerializedQuest } from './quests/serialized-quest.js';
export type { SerializedQuestGoal } from './quests/serialized-quest-goal.js';
export type { SerializedQuestTracker } from './quests/serialized-quest-tracker.js';

// util
export * as CharacterUtils from './util/characters.js';
export * as CombatUtils from './util/combat.js';
export * as CommunicationUtils from './util/communication.js';
export * as DataUtils from './util/data.js';
export * as FnUtils from './util/functions.js';
export * as ItemUtils from './util/items.js';
export * as LevelUtils from './util/level-util.js';
export * as ObjectUtils from './util/objects.js';
export * as PlayerUtils from './util/player.js';
export * as RandomUtils from './util/random.js';
export * as TimeUtils from './util/time.js';

export { Config, type MudConfig } from './util/config.js';
export type { SimpleMap } from './util/simple-map.js';
