import path from 'node:path';

import { Command } from 'commander';

import {
    BundleManager,
    Config,
    FnUtils,
    GameState,
    Logger,
    type MudConfig,
} from './lib/index.js';

/*
 * Set debug variable and encoding.
 * 'net' by default to help find possible server errors.
 */
process.env.NODE_DEBUG = 'net';
process.stdin.setEncoding('utf8');

/* It's over 9000! */
const DEFAULT_PORT = 9001;

export default class AdamantiaServer {
    private readonly _config: Config;
    private readonly _program: Command;
    private readonly _state: GameState;

    public constructor(mudConfig: MudConfig) {
        this._config = new Config();
        this._config.load(mudConfig);
        this._state = new GameState(this._config);

        this._program = new Command();
        this._program
            .option(
                '-p, --port [portNumber]',
                `Port to host the server [${DEFAULT_PORT}]`,
                String(this._config.get<number>('port', DEFAULT_PORT))
            )
            .option('-v, --verbose', 'Verbose console logging.', true)
            .parse(process.argv);
    }

    public async init(): Promise<void> {
        const logfile = this._config.getLogfile();

        if (FnUtils.hasValue(logfile)) {
            Logger.setFileLogging(
                path.join(this._config.getPath('root'), 'log', logfile)
            );
        }

        // Set logging level based on CLI option or environment variable.
        /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
        const logLevel = this._program.getOptionValue('verbose')
            ? 'verbose'
            : process.env.LOG_LEVEL ?? this._config.get('logLevel', 'debug')!;

        Logger.setLevel(logLevel);

        Logger.log('START - Initializing mud');

        const manager = new BundleManager(this._state);

        await manager.loadBundles();
    }

    public start(): void {
        Logger.log('START - Starting server');

        this._state.startServer(this._program);
    }
}
