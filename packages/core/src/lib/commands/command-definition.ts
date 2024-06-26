import type PlayerRole from '../players/player-role.js';
import type SimpleMap from '../util/simple-map.js';

import type CommandExecutable from './command-executable.js';
import type CommandType from './command-type.js';

export interface CommandDefinition {
    aliases?: string[];
    command: CommandExecutable;
    metadata?: SimpleMap;
    name: string;
    requiredRole?: PlayerRole;
    type?: CommandType;
    usage?: string;
}

export default CommandDefinition;
