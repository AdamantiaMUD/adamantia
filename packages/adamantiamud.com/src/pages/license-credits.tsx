import type { FC } from 'react';

import PageTitle from '../components/general/page-title';
import Layout from '../components/layout';

export const SecondPage: FC = () => (
    <Layout>
        <PageTitle>License & Credits</PageTitle>
        <p>Adamantia is released under the MIT license.</p>

        <h2>Credits</h2>
        <p>
            Adamantia began its life as a fork of{' '}
            <a href="https://ranviermud.com/">Ranvier</a>, a MUD engine written
            for Node.js. At first, it was primarily a simple port to TypeScript.
            However, nearly every aspect of the code has undergone some change.
        </p>

        <h3>Creator</h3>
        <p>
            Bill Parrott (
            <a href="https://github.com/chimericdream">
                github.com/chimericdream
            </a>
            )
        </p>
    </Layout>
);

export default SecondPage;