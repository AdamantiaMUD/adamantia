/* eslint-disable no-process-env */
import commander from 'commander';
import path from 'path';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

import {
    BundleManager,
    Config,
    GameState,
    Logger,
    FnUtils,
} from '@adamantiamud/core';

import type {MudConfig} from '../../core/build/lib/util/config';

/* eslint-disable-next-line @typescript-eslint/naming-convention, id-match */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/* eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-commonjs */
const serverConfig = require('./adamantia.json') as MudConfig;

/*
 * Set debug variable and encoding.
 * 'net' by default to help find possible server errors.
 */
process.env.NODE_DEBUG = 'net';
process.stdin.setEncoding('utf8');

/* It's over 9000! */
const DEFAULT_PORT = 9001;

const init = async (): Promise<void> => {
    const config = new Config();

    config.load({
        ...serverConfig,
        paths: {
            bundles: path.join(__dirname, 'bundles'),
            data: path.join(__dirname, '..', 'data'),
            root: __dirname,
        },
    });

    // cmdline options
    commander
        .option(
            '-p, --port [portNumber]',
            `Port to host the server [${DEFAULT_PORT}]`,
            String(config.get<number>('port', DEFAULT_PORT))
        )
        .option('-v, --verbose', 'Verbose console logging.', true)
        .parse(process.argv);

    const logfile = config.getLogfile();

    if (FnUtils.hasValue(logfile)) {
        Logger.setFileLogging(`${__dirname}/log/${logfile}`);
    }

    // Set logging level based on CLI option or environment variable.
    const logLevel = commander.verbose
        ? 'verbose'
        : process.env.LOG_LEVEL ?? config.get('logLevel', 'debug')!;

    Logger.setLevel(logLevel);

    const state: GameState = new GameState(config);

    Logger.log('START - Initializing mud');

    const manager = new BundleManager(state);

    await manager.loadBundles();

    Logger.log('START - Starting server');

    state.startServer(commander);
};

/* eslint-disable-next-line no-void */
void init();
