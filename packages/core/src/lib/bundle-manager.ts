/* eslint-disable import/max-dependencies, no-await-in-loop */
/* eslint-disable-next-line id-length */
import fs, { type Dirent } from 'fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import yaml from 'js-yaml';

import type AttributeDefinition from './attributes/attribute-definition.js';
import type BehaviorManager from './behaviors/behavior-manager.js';
import type CommandDefinition from './commands/command-definition.js';
import Command from './commands/command.js';
import Logger, { logAndRethrow } from './common/logger.js';
import AreaEntitiesLoader from './data/area-entities-loader.js';
import BundleAreasLoader from './data/bundle-areas-loader.js';
import EntityFactory from './entities/entity-factory.js';
import type GameEntityDefinition from './entities/game-entity-definition.js';
import type GameEntity from './entities/game-entity.js';
import type ScriptableEntityDefinition from './entities/scriptable-entity-definition.js';
import type ScriptableEntity from './entities/scriptable-entity.js';
import GameState from './game-state.js';
import type HelpfileOptions from './help/helpfile-options.js';
import Helpfile from './help/helpfile.js';
import type AreaDefinition from './locations/area-definition.js';
import type AreaManifest from './locations/area-manifest.js';
import type {
    AttributeModule,
    BehaviorModule,
    CharacterClassModule,
    CombatEngineModule,
    CommandModule,
    EffectModule,
    EntityScriptModule,
    InputEventModule,
    PlayerEventModule,
    QuestGoalModule,
    QuestRewardModule,
    ServerEventModule,
} from './module-helpers/index.js';
import type QuestDefinition from './quests/quest-definition.js';
import { colorize } from './util/communication.js';
import Data from './util/data.js';
import { cast, hasValue } from './util/functions.js';

/* eslint-disable-next-line @typescript-eslint/naming-convention, id-match */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const coreBundlesFolder = path.join(__dirname, '..', 'core-bundles');
const optionalBundlesFolder = path.join(__dirname, '..', 'optional-bundles');

const getDirectories = async (directory: string): Promise<string[]> => {
    const files: Dirent[] = await fsp.readdir(directory, {
        withFileTypes: true,
    });

    return files
        .filter((file: Dirent): boolean => file.isDirectory())
        .map((file: Dirent): string => file.name);
};

const getFiles = async (directory: string): Promise<string[]> => {
    const files: Dirent[] = await fsp.readdir(directory, {
        withFileTypes: true,
    });

    return files
        .filter(
            (file: Dirent): boolean =>
                !file.isDirectory() && !file.name.endsWith('.d.ts')
        )
        .map((file: Dirent): string => file.name);
};

const getPathToBundle = (bundleRef: string, bundlesFolder?: string): string => {
    if (bundleRef.startsWith('core.')) {
        return path.join(coreBundlesFolder, bundleRef.substring(5));
    }

    if (bundleRef.startsWith('adamantia.')) {
        return path.join(optionalBundlesFolder, bundleRef.substring(10));
    }

    return path.join(bundlesFolder ?? '', bundleRef);
};

export class BundleManager {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    private readonly _areas: string[] = [];
    private readonly _state: GameState;
    /* eslint-enable @typescript-eslint/lines-between-class-members */

    public constructor(state: GameState) {
        const bundlePath: string = state.config.getPath('bundles');
        const dataPath: string = state.config.getPath('data');
        const rootPath: string = state.config.getPath('root');

        if (!hasValue<string>(bundlePath) || !fs.existsSync(bundlePath)) {
            Logger.error(`Bundle path "${String(bundlePath)}" is not valid`);
            throw new Error('Invalid bundle path');
        }

        if (!hasValue<string>(dataPath) || !fs.existsSync(dataPath)) {
            Logger.error(`Data path "${String(dataPath)}" is not valid`);
            throw new Error('Invalid data path');
        }

        if (!hasValue<string>(rootPath) || !fs.existsSync(rootPath)) {
            Logger.error(`Root path "${String(rootPath)}" is not valid`);
            throw new Error('Invalid root path');
        }

        this._state = state;
    }

    private async _createCommand(
        uri: string,
        name: string,
        bundle: string
    ): Promise<Command> {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        const commandImport: CommandModule = await import(
            pathToFileURL(uri).toString()
        );
        const loader = commandImport.default;

        const commandDef: CommandDefinition = {
            ...loader,
            command: loader.command(this._state),
        };

        return new Command(bundle, name, commandDef, uri);
    }

    private static _getAreaScriptPath(
        bundlePath: string,
        areaName: string
    ): string {
        return path.join(bundlePath, 'areas', areaName, 'scripts');
    }

    private _hydrateAreas(): void {
        for (const areaRef of this._areas) {
            const area = this._state.areaFactory.create(areaRef);

            try {
                area.hydrate(this._state);
            } catch (err: unknown) {
                logAndRethrow(err);
            }

            this._state.areaManager.addArea(area);
        }
    }

    private _isBundleEnabled(bundle: string, prefix: string = ''): boolean {
        if (prefix === 'core.') {
            return true;
        }

        return this._state.config.getBundles().includes(`${prefix}${bundle}`);
    }

    private static _isValidBundle(bundle: string, bundlePath: string): boolean {
        return !(
            fs.statSync(bundlePath).isFile() ||
            bundle === '.' ||
            bundle === '..'
        );
    }

    private async _loadArea(
        bundle: string,
        bundlePath: string,
        areaRef: string,
        manifest: AreaManifest
    ): Promise<void> {
        Logger.info(`LOAD: ${bundle} - Area \`${areaRef}\` -- START`);

        const definition: AreaDefinition = {
            bundle: bundle,
            bundlePath: bundlePath,
            id: areaRef,
            items: [],
            manifest: manifest,
            npcs: [],
            quests: [],
            rooms: [],
        };

        Logger.verbose(`LOAD: Area \`${areaRef}\`: Quests...`);
        definition.quests = await this._loadQuests(bundle, areaRef);

        Logger.verbose(`LOAD: Area \`${areaRef}\`: Items...`);
        definition.items = await this._loadEntities(
            bundle,
            bundlePath,
            areaRef,
            'items',
            this._state.itemFactory
        );

        Logger.verbose(`LOAD: Area \`${areaRef}\`: NPCs...`);
        definition.npcs = await this._loadEntities(
            bundle,
            bundlePath,
            areaRef,
            'npcs',
            this._state.mobFactory
        );

        Logger.verbose(`LOAD: Area \`${areaRef}\`: Rooms...`);
        definition.rooms = await this._loadEntities(
            bundle,
            bundlePath,
            areaRef,
            'rooms',
            this._state.roomFactory
        );

        this._state.areaFactory.setDefinition(areaRef, definition);

        Logger.info(`LOAD: ${bundle} - Area \`${areaRef}\` -- END`);
    }

    private async _loadAreas(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        Logger.info(`LOAD: ${bundle} - Areas -- START`);

        const loader = new BundleAreasLoader(bundle);

        const areas: Record<string, AreaManifest> = await loader.loadManifests(
            this._state.config
        );

        for (const [ref, manifest] of Object.entries(areas)) {
            this._areas.push(ref);

            await this._loadArea(bundle, bundlePath, ref, manifest);
        }

        Logger.info(`LOAD: ${bundle} - Areas -- END`);
    }

    private _loadAttribute(
        def: AttributeDefinition,
        bundle: string,
        error: string
    ): void {
        if (typeof def !== 'object') {
            Logger.error(`${error} not an object`);

            return;
        }

        if (!('name' in def) || !('base' in def)) {
            Logger.error(
                `${error} does not include required properties name and base`
            );

            return;
        }

        Logger.verbose(`LOAD: ${bundle} - Attributes -> ${def.name}`);

        this._state.attributeFactory.add(def);
    }

    private async _loadAttributes(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'attributes.js');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Attributes -- START`);

        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        const attributeImport: AttributeModule = await import(
            pathToFileURL(uri).toString()
        );
        const attributes = attributeImport.default;

        const error = `Attributes file [${uri}] from bundle [${bundle}]`;

        if (!Array.isArray(attributes)) {
            Logger.error(`${error} does not define an array of attributes`);

            return Promise.resolve();
        }

        for (const attribute of attributes) {
            this._loadAttribute(attribute, bundle, error);
        }

        Logger.info(`LOAD: ${bundle} - Attributes -- END`);

        return Promise.resolve();
    }

    private async _loadBehaviors(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'behaviors');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Behaviors -- START`);

        const loadEntityBehaviors = async (
            type: string,
            manager: BehaviorManager,
            state: GameState
        ): Promise<void> => {
            const typeDir = path.join(uri, type);

            if (!fs.existsSync(typeDir)) {
                return;
            }

            Logger.verbose(`LOAD: ${bundle} - Behaviors -> ${type}`);
            const files = await getFiles(typeDir);

            for (const behaviorFile of files) {
                const behaviorPath = path.join(typeDir, behaviorFile);

                if (Data.isScriptFile(behaviorPath, behaviorFile)) {
                    const behaviorName = path.basename(
                        behaviorFile,
                        path.extname(behaviorFile)
                    );

                    Logger.verbose(
                        `LOAD: ${bundle} - Behaviors -> ${type} -> ${behaviorName}`
                    );

                    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                    const behaviorImport: BehaviorModule = await import(
                        pathToFileURL(behaviorPath).toString()
                    );
                    const loader = behaviorImport.default;

                    const { listeners } = loader;

                    for (const [eventName, listener] of Object.entries(
                        listeners
                    )) {
                        manager.addListener(
                            behaviorName,
                            eventName,
                            listener(state)
                        );
                    }
                }
            }
        };

        await loadEntityBehaviors(
            'area',
            this._state.areaBehaviorManager,
            this._state
        );
        await loadEntityBehaviors(
            'npc',
            this._state.mobBehaviorManager,
            this._state
        );
        await loadEntityBehaviors(
            'item',
            this._state.itemBehaviorManager,
            this._state
        );
        await loadEntityBehaviors(
            'room',
            this._state.roomBehaviorManager,
            this._state
        );

        Logger.info(`LOAD: ${bundle} - Behaviors -- END`);

        return Promise.resolve();
    }

    private async _loadBundle(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        Logger.info(colorize(`LOAD: BUNDLE [{yellow ${bundle}}] -- START`));

        await this._loadQuestGoals(bundle, bundlePath);
        await this._loadQuestRewards(bundle, bundlePath);
        await this._loadQuests(bundle, bundlePath);
        await this._loadAttributes(bundle, bundlePath);
        await this._loadBehaviors(bundle, bundlePath);

        // await this.loadChannels(bundle, bundlePath);
        await this._loadNpcClasses(bundle, bundlePath);
        await this._loadPlayerClasses(bundle, bundlePath);
        await this._loadCommands(bundle, bundlePath);
        await this._loadEffects(bundle, bundlePath);
        await this._loadInputEvents(bundle, bundlePath);
        await this._loadServerEvents(bundle, bundlePath);
        await this._loadPlayerEvents(bundle, bundlePath);

        // await this.loadSkills(bundle, bundlePath);
        await this._loadHelp(bundle, bundlePath);

        await this._loadAreas(bundle, bundlePath);

        Logger.info(colorize(`LOAD: BUNDLE [{yellow ${bundle}}] -- END`));
    }

    private async _loadBundlesFromFolder(
        bundlesPath: string,
        prefix: string = ''
    ): Promise<void> {
        Logger.verbose(`Loading bundles from: '${bundlesPath}'`);

        const bundles = await getDirectories(bundlesPath);

        for (const bundle of bundles) {
            const bundlePath = path.join(bundlesPath, bundle);

            // only load bundles the user has configured to be loaded
            if (
                BundleManager._isValidBundle(bundle, bundlePath) &&
                this._isBundleEnabled(bundle, prefix)
            ) {
                await this._loadBundle(`${prefix}${bundle}`, bundlePath);
            }
        }
    }

    private async _loadCombatEngine(bundlesFolder: string): Promise<void> {
        const bundle = this._state.config.getCombatEngine();
        if (!bundle || !this._isBundleEnabled(bundle)) {
            return;
        }

        const bundlePath = getPathToBundle(bundle, bundlesFolder);
        const combatEnginePath = (await getFiles(bundlePath)).find(
            (name: string): boolean => name.startsWith('combat-engine')
        );

        if (!combatEnginePath) {
            return;
        }

        const uri = path.join(bundlePath, combatEnginePath);
        if (Data.isScriptFile(uri)) {
            Logger.verbose(`LOAD: ${bundle} - Combat Engine -- START`);

            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            const engineImport: CombatEngineModule = await import(
                pathToFileURL(uri).toString()
            );
            const Engine = engineImport.default;
            this._state.setCombatEngine(new Engine());

            Logger.verbose(`LOAD: ${bundle} - Combat Engine -- END`);
        }
    }

    private async _loadCommands(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'commands');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Commands -- START`);

        const files = await getFiles(uri);

        for (const commandFile of files) {
            const commandPath = path.join(uri, commandFile);

            if (Data.isScriptFile(commandPath, commandFile)) {
                const commandName = path.basename(
                    commandFile,
                    path.extname(commandFile)
                );

                Logger.verbose(`LOAD: ${bundle} - Commands -> ${commandName}`);

                const command = await this._createCommand(
                    commandPath,
                    commandName,
                    bundle
                );

                this._state.commandManager.add(command);
            }
        }

        Logger.info(`LOAD: ${bundle} - Commands -- END`);

        return Promise.resolve();
    }

    private async _loadEffects(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'effects');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Effects -- START`);

        const files = await getFiles(uri);

        for (const effectFile of files) {
            const effectPath = path.join(uri, effectFile);

            if (Data.isScriptFile(effectPath, effectFile)) {
                const effectName = path.basename(
                    effectFile,
                    path.extname(effectFile)
                );

                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const effectImport: EffectModule = await import(
                    pathToFileURL(effectPath).toString()
                );
                const loader = effectImport.default;

                Logger.verbose(`LOAD: ${bundle} - Effects -> ${effectName}`);

                this._state.effectFactory.add(effectName, loader, this._state);
            }
        }

        Logger.info(`LOAD: ${bundle} - Effects -- END`);

        return Promise.resolve();
    }

    private async _loadEntities<
        E extends GameEntity | ScriptableEntity,
        EDef extends GameEntityDefinition | ScriptableEntityDefinition,
        T extends EntityFactory<E, EDef>,
    >(
        bundle: string,
        bundlePath: string,
        areaRef: string,
        type: 'items' | 'npcs' | 'rooms',
        factory: T
    ): Promise<string[]> {
        const loader = new AreaEntitiesLoader(bundle, areaRef, type);

        const entities = await loader.loadEntities<EDef>(this._state.config);
        const scriptPath = BundleManager._getAreaScriptPath(
            bundlePath,
            areaRef
        );

        return Promise.all(
            Object.values(entities).map(async (entityDef: EDef) => {
                const entity = { ...entityDef };

                if (type === 'npcs' || type === 'items') {
                    const requiredAttributes =
                        this._state.attributeFactory.getRequiredAttributes(
                            type === 'npcs' ? 'npc' : 'item'
                        );

                    for (const attr of requiredAttributes) {
                        if (
                            typeof (entity as ScriptableEntityDefinition)
                                .attributes === 'undefined'
                        ) {
                            (entity as ScriptableEntityDefinition).attributes =
                                {};
                        }

                        if (
                            typeof (entity as ScriptableEntityDefinition)
                                .attributes![attr] === 'undefined'
                        ) {
                            (entity as ScriptableEntityDefinition).attributes![
                                attr
                            ] = {
                                base: this._state.attributeFactory.get(attr)!
                                    .base,
                            };
                        }
                    }
                }

                const entityRef = EntityFactory.createRef(areaRef, entity.id);

                factory.setDefinition(entityRef, entity);

                if (
                    'script' in entity &&
                    hasValue(cast<ScriptableEntityDefinition>(entity).script)
                ) {
                    const script =
                        cast<ScriptableEntityDefinition>(entity).script!;

                    const scriptUri = path.join(scriptPath, type, script);

                    Logger.verbose(
                        `Loading entity script - [${entityRef}] -> ${script}`
                    );

                    try {
                        await this._loadEntityScript(
                            factory,
                            entityRef,
                            scriptUri
                        );
                    } catch {
                        Logger.warn(
                            `Missing entity script - [${entityRef}] -> ${script}`
                        );
                    }
                }

                return Promise.resolve(entityRef);
            })
        );
    }

    private async _loadEntityScript<
        E extends ScriptableEntity,
        EDef extends ScriptableEntityDefinition,
        T extends EntityFactory<E, EDef>,
    >(factory: T, ref: string, scriptPath: string): Promise<void> {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        const scriptImport: EntityScriptModule = await import(
            pathToFileURL(scriptPath).toString()
        );
        const loader = scriptImport.default;

        const { listeners } = loader;

        Logger.info(`LOAD: ${ref} - Script Listeners -- START`);

        for (const [eventName, listener] of Object.entries(listeners)) {
            Logger.verbose(`LOAD: ${ref} - Script Listeners -> ${eventName}`);

            factory.addScriptListener(ref, eventName, listener(this._state));
        }

        Logger.info(`LOAD: ${ref} - Script Listeners -- END`);
    }

    private async _loadHelp(bundle: string, bundlePath: string): Promise<void> {
        const uri = path.join(bundlePath, 'help');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Help -- START`);

        const files = await getFiles(uri);

        for (const file of files) {
            const helpName = path.basename(file, path.extname(file));

            Logger.verbose(`LOAD: ${bundle} - Help -> ${helpName}`);

            const helpPath = path.join(uri, file);

            let contents = await fsp.readFile(helpPath, 'utf8');

            if (contents.trim().endsWith('.yml')) {
                const referencedPath = path.join(uri, contents.trim());

                if (fs.existsSync(referencedPath)) {
                    contents = await fsp.readFile(referencedPath, 'utf8');
                } else {
                    // @TODO: Error
                }
            }

            const helpData: HelpfileOptions = yaml.load(
                contents
            ) as HelpfileOptions;

            const helpFile = new Helpfile(bundle, helpName, helpData);

            this._state.helpManager.add(helpFile);
        }

        Logger.info(`LOAD: ${bundle} - Help -- END`);

        return Promise.resolve();
    }

    private async _loadInputEvents(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'input-events');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Input Events -- START`);
        const files = await getFiles(uri);

        for (const eventFile of files) {
            const eventPath = path.join(uri, eventFile);

            if (Data.isScriptFile(eventPath, eventFile)) {
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const eventImport: InputEventModule = await import(
                    pathToFileURL(eventPath).toString()
                );
                const inputEvent = eventImport.default;

                Logger.verbose(
                    `LOAD: ${bundle} - Input Events -> ${inputEvent.name}`
                );

                this._state.streamEventManager.add(
                    inputEvent.name,
                    inputEvent.listener(this._state)
                );
            }
        }

        Logger.info(`LOAD: ${bundle} - Input Events -- END`);

        return Promise.resolve();
    }

    private async _loadNpcClasses(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'classes', 'npcs');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - NPC Classes -- START`);
        const files = await getFiles(uri);

        for (const classFile of files) {
            const classPath = path.join(uri, classFile);

            if (Data.isScriptFile(classPath, classFile)) {
                const className = path.basename(
                    classFile,
                    path.extname(classFile)
                );

                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const classImport: CharacterClassModule = await import(
                    pathToFileURL(classPath).toString()
                );
                const classDef = classImport.default;

                Logger.verbose(`LOAD: ${bundle} - NPC Classes -> ${className}`);

                this._state.npcClassManager.set(className, classDef);
            }
        }

        Logger.info(`LOAD: ${bundle} - NPC Classes -- END`);

        return Promise.resolve();
    }

    private async _loadPlayerClasses(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'classes', 'players');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Player Classes -- START`);
        const files = await getFiles(uri);

        for (const classFile of files) {
            const classPath = path.join(uri, classFile);

            if (Data.isScriptFile(classPath, classFile)) {
                const className = path.basename(
                    classFile,
                    path.extname(classFile)
                );

                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const classImport: CharacterClassModule = await import(
                    pathToFileURL(classPath).toString()
                );
                const classDef = classImport.default;

                Logger.verbose(
                    `LOAD: ${bundle} - Player Classes -> ${className}`
                );

                this._state.playerClassManager.set(className, classDef);
            }
        }

        Logger.info(`LOAD: ${bundle} - Player Classes -- END`);

        return Promise.resolve();
    }

    private async _loadPlayerEvents(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'player-events');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Player Events -- START`);

        const files = await getFiles(uri);

        for (const eventFile of files) {
            const eventPath = path.join(uri, eventFile);

            if (Data.isScriptFile(eventPath, eventFile)) {
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const eventImport: PlayerEventModule = await import(
                    pathToFileURL(eventPath).toString()
                );
                const playerEvent = eventImport.default;

                Logger.verbose(
                    `LOAD: ${bundle} - Player Events -> ${playerEvent.name}`
                );

                this._state.playerManager.addListener(
                    playerEvent.name,
                    playerEvent.listener(this._state)
                );
            }
        }

        Logger.info(`LOAD: ${bundle} - Player Events -- END`);

        return Promise.resolve();
    }

    private async _loadQuestGoals(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'quests', 'goals');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Quest Goals -- START`);

        const files = await getFiles(uri);

        for (const goalFile of files) {
            const goalPath = path.join(uri, goalFile);

            if (Data.isScriptFile(goalPath, goalFile)) {
                const goalName = path.basename(
                    goalFile,
                    path.extname(goalFile)
                );

                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const goalImport: QuestGoalModule = await import(
                    pathToFileURL(goalPath).toString()
                );
                const loader = goalImport.default;

                Logger.verbose(`LOAD: ${bundle} - Quest Goals -> ${goalName}`);

                this._state.questGoalManager.set(goalName, loader);
            }
        }

        Logger.info(`LOAD: ${bundle} - Quest Goals -- END`);

        return Promise.resolve();
    }

    private async _loadQuestRewards(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'quests', 'rewards');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Quest Rewards -- START`);
        const files = await getFiles(uri);

        for (const rewardFile of files) {
            const rewardPath = path.join(uri, rewardFile);

            if (Data.isScriptFile(rewardPath, rewardFile)) {
                const rewardName = path.basename(
                    rewardFile,
                    path.extname(rewardFile)
                );

                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const rewardImport: QuestRewardModule = await import(
                    pathToFileURL(rewardPath).toString()
                );
                const loader = rewardImport.default;

                Logger.verbose(
                    `LOAD: ${bundle} - Quest Rewards -> ${rewardName}`
                );

                this._state.questRewardManager.set(rewardName, loader);
            }
        }

        Logger.info(`LOAD: ${bundle} - Quest Rewards -- END`);

        return Promise.resolve();
    }

    private async _loadQuests(
        bundle: string,
        areaRef: string
    ): Promise<string[]> {
        const loader = new AreaEntitiesLoader(bundle, areaRef, 'quests');

        const quests: Record<string, QuestDefinition> =
            await loader.loadEntities<QuestDefinition>(this._state.config);

        return Object.values(quests).map((quest: QuestDefinition) => {
            const ref = `${areaRef}:${quest.id}`;

            Logger.verbose(
                `LOAD: ${bundle} - Areas -> ${areaRef} -> Quests -> ${ref}`
            );

            this._state.questFactory.add(ref, areaRef, quest.id, quest);

            return ref;
        });
    }

    private async _loadServerEvents(
        bundle: string,
        bundlePath: string
    ): Promise<void> {
        const uri = path.join(bundlePath, 'server-events');

        if (!fs.existsSync(uri)) {
            return Promise.resolve();
        }

        Logger.info(`LOAD: ${bundle} - Server Events -- START`);

        const files = await getFiles(uri);

        for (const eventFile of files) {
            const eventPath = path.join(uri, eventFile);

            if (Data.isScriptFile(eventPath, eventFile)) {
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
                const eventImport: ServerEventModule = await import(
                    pathToFileURL(eventPath).toString()
                );
                const serverEvent = eventImport.default;

                Logger.verbose(
                    `LOAD: ${bundle} - Server Events -> ${serverEvent.name}`
                );

                this._state.serverEventManager.add(
                    serverEvent.name,
                    serverEvent.listener(this._state)
                );
            }
        }

        Logger.info(`LOAD: ${bundle} - Server Events -- END`);

        return Promise.resolve();
    }

    public async loadBundles(): Promise<void> {
        Logger.verbose('LOAD: BUNDLES -- START');

        const bundlesFolder: string = this._state.config.getPath('bundles');

        await this._loadBundlesFromFolder(coreBundlesFolder, 'core.');
        await this._loadBundlesFromFolder(optionalBundlesFolder, 'adamantia.');
        await this._loadBundlesFromFolder(bundlesFolder);

        await this._loadCombatEngine(bundlesFolder);

        Logger.verbose('LOAD: BUNDLES -- END');

        /*
         * Distribution is done after all areas are loaded in case items in one
         * area depend on another area.
         */
        this._hydrateAreas();
    }
}

export default BundleManager;
