import type ScriptableEntityDefinition from '../entities/scriptable-entity-definition.js';
import type SimpleMap from '../util/simple-map.js';

export interface NpcDefinition extends ScriptableEntityDefinition {
    corpseDesc?: string;
    defaultEquipment?: Record<string, string>;
    description: string;
    entityReference: string;
    id: string;
    items?: string[];
    keywords: string[];
    level: number;
    metadata?: SimpleMap;
    name: string;
    quests?: string[];
    roomDesc?: string;
    shortName?: string;
    type?: string;
    uuid?: string;
}

export default NpcDefinition;
