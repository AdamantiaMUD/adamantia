/* eslint-disable-next-line id-length */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type SerializedAccount from '../players/serialized-account.js';
import type Config from '../util/config.js';

export class AccountLoader {
    public async loadAccount(
        accountName: string,
        config: Config
    ): Promise<SerializedAccount | null> {
        const uri = path.join(
            config.getPath('data'),
            'account',
            `${accountName}.json`
        );

        if (!fs.existsSync(uri)) {
            return null;
        }

        const player: string = await fsp.readFile(uri, 'utf8');

        return JSON.parse(player) as SerializedAccount;
    }

    public async saveAccount(
        accountName: string,
        data: SerializedAccount,
        config: Config
    ): Promise<void> {
        const uri = path.join(
            config.getPath('data'),
            'account',
            `${accountName}.json`
        );

        await fsp.writeFile(uri, JSON.stringify(data, null, 2));
    }
}

export default AccountLoader;
