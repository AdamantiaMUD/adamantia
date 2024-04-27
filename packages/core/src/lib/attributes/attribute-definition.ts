import type SimpleMap from '../util/simple-map.js';

import type AttributeFormulaDefinition from './attribute-formula-definition.js';

export type EntityAttributeRule = false | 'optional' | 'required';

export interface AttributeDefinition {
    name: string;
    base: number;
    formula?: AttributeFormulaDefinition | null;
    metadata?: SimpleMap;
    entityTypes?: Partial<{
        item: EntityAttributeRule;
        npc: EntityAttributeRule;
        player: EntityAttributeRule;
    }>;
}

export default AttributeDefinition;
