import type { RoomDefinition } from '@adamantiamud/core';
import type { ElementDefinition } from 'cytoscape';

export interface AreaGraph {
    name: string;
    rooms: Record<string, RoomDefinition>;
    nodes: ElementDefinition[];
}

export interface RoomElementDefinition extends ElementDefinition {
    data: ElementDefinition['data'] & {
        layer: number;
    };
    position: Required<ElementDefinition>['position'];
}
