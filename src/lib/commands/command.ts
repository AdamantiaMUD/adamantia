import CommandType from './command-type';
import Player from '../players/player';
import PlayerRole from '../players/player-role';
import {SimpleMap} from '../../../index';

export interface CommandDefinition {
    aliases?: string[];
    command: CommandExecutable;
    metadata?: SimpleMap;
    name: string;
    requiredRole?: PlayerRole;
    type?: CommandType;
    usage?: string;
}

export type CommandExecutable = (
    args: string,
    player: Player,
    alias?: string,
    ...argV: any[]
) => void;

/**
 * In game command. See the {@link http://ranviermud.com/extending/commands/|Command guide}
 */
export class Command {
    /* eslint-disable lines-between-class-members */
    public aliases: string[];
    public bundle: string;
    public file: string;
    public func: CommandExecutable;
    public metadata: SimpleMap;
    public name: string;
    public requiredRole: PlayerRole;
    public type: CommandType;
    public usage: string;
    /* eslint-enable lines-between-class-members */

    public constructor(bundle: string, name: string, def: CommandDefinition, file: string) {
        this.bundle = bundle;
        this.type = def.type || CommandType.COMMAND;
        this.name = name;
        this.func = def.command;
        this.aliases = def.aliases || [];
        this.usage = def.usage || this.name;
        this.requiredRole = def.requiredRole || PlayerRole.PLAYER;
        this.file = file;
        this.metadata = def.metadata || {};
    }

    public execute(args: string, player: Player, alias: string = '', ...argV: any[]): void {
        this.func(args, player, alias, ...argV);
    }
}

export default Command;
