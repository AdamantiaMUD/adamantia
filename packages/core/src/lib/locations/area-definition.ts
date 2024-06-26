import type ScriptableEntityDefinition from '../entities/scriptable-entity-definition.js';

import type AreaManifest from './area-manifest.js';

export interface AreaDefinition extends ScriptableEntityDefinition {
    bundle: string;
    bundlePath: string;
    items: string[];
    manifest: AreaManifest;
    npcs: string[];
    quests: string[];
    rooms: string[];
}

export default AreaDefinition;
