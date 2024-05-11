/* eslint-disable-next-line id-length */
import fs, { type Dirent } from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import type AreaManifest from '../locations/area-manifest.js';
import type Config from '../util/config.js';

import BundleObjectLoader from './bundle-object-loader.js';

export class BundleAreasLoader extends BundleObjectLoader {
    public constructor(bundle: string) {
        super(bundle);
    }

    private static async _loadManifest(
        manifestPath: string
    ): Promise<AreaManifest> {
        const rawManifest: string = await fsp.readFile(manifestPath, 'utf8');

        return JSON.parse(rawManifest) as AreaManifest;
    }

    public hasAreas(config: Config): boolean {
        const folder = path.join(this._getBundleFolder(config), 'areas');

        return fs.existsSync(folder);
    }

    public async loadManifests(
        config: Config
    ): Promise<Record<string, AreaManifest>> {
        if (!this.hasAreas(config)) {
            return {};
        }

        const bundleFolder = this._getBundleFolder(config);
        const areasFolder = path.join(bundleFolder, 'areas');

        const files: Dirent[] = await fsp.readdir(areasFolder, {
            withFileTypes: true,
        });

        const areas: Record<string, AreaManifest> = {};

        for (const file of files) {
            const manifestPath = path.join(
                areasFolder,
                file.name,
                'manifest.json'
            );

            if (file.isDirectory() && fs.existsSync(manifestPath)) {
                /* eslint-disable no-await-in-loop */
                areas[file.name] =
                    await BundleAreasLoader._loadManifest(manifestPath);
                /* eslint-enable no-await-in-loop */
            }
        }

        return areas;
    }
}

export default BundleAreasLoader;
