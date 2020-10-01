import type GameEntityInterface from './game-entity-interface';
import type GameStateData from '../game-state-data';
import type SimpleMap from '../util/simple-map';
import type {SerializedScriptableEntity} from './scriptable-entity';

export interface ScriptableEntityInterface extends GameEntityInterface {
    readonly behaviors: Map<string, SimpleMap | true | null>;
    getBehavior: (name: string) => (SimpleMap | true | null);
    hasBehavior: (name: string) => boolean;
    hydrate: (state: GameStateData) => void;
    serialize: () => SerializedScriptableEntity;
}
export default ScriptableEntityInterface;
