import { Link } from '@mui/material';
import type { FC } from 'react';

import PageTitle from '../components/general/page-title';
import Layout from '../components/layout';

export const LicenseCreditsPage: FC = () => (
    <Layout>
        <PageTitle>License & Credits</PageTitle>
        <p>Adamantia is released under the MIT license.</p>

        <h2>Credits</h2>
        <p>
            Adamantia began its life as a fork of{' '}
            <Link href="https://ranviermud.com/">Ranvier</Link>, a MUD engine
            written for Node.js. At first, it was primarily a simple port to
            TypeScript. However, nearly every aspect of the code has undergone
            some change.
        </p>

        <h3>Creator</h3>
        <p>
            Bill Parrott (
            <Link href="https://github.com/chimericdream">
                github.com/chimericdream
            </Link>
            )
        </p>
    </Layout>
);

export default LicenseCreditsPage;
