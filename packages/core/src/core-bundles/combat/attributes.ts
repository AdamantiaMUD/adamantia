import type AttributeDefinition from '../../lib/attributes/attribute-definition.js';

const atts: AttributeDefinition[] = [
    {
        name: 'hp',
        base: 1,
        entityTypes: { item: false, npc: 'required', player: 'required' },
    },
];

export default atts;
