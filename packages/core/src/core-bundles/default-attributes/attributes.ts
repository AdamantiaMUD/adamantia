import type AttributeDefinition from '../../lib/attributes/attribute-definition.js';

const atts: AttributeDefinition[] = [
    {
        name: 'move',
        base: 80,
        entityTypes: { item: false, npc: 'optional', player: 'required' },
    },
];

export default atts;
