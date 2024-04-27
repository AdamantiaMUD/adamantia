import Config, { DEFAULT_CONFIG } from '../../../src/lib/util/config.js';

const TEST_CONFIG = {
    ...DEFAULT_CONFIG,
    combatEngine: 'test',
    logfile: 'test.log',
};

describe('config.ts', () => {
    it('`load()` should populate the data correctly', () => {
        expect.assertions(2);

        const cfg = new Config();

        expect(cfg.get('logfile')).toBe('');

        cfg.load(TEST_CONFIG);

        expect(cfg.get('logfile')).toBe(TEST_CONFIG.logfile);
    });

    it('`set()` should update a value correctly', () => {
        expect.assertions(2);

        const cfg = new Config();

        cfg.load(TEST_CONFIG);

        expect(cfg.get('logfile')).toBe(TEST_CONFIG.logfile);

        cfg.set('logfile', 'something-else.log');

        expect(cfg.get('logfile')).toBe('something-else.log');
    });
});
