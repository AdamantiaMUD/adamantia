import type { FC } from 'react';

import PageTitle from '../components/general/page-title';
import Layout from '../components/layout';

export const NotFoundPage: FC = () => (
    <Layout>
        <PageTitle>NOT FOUND</PageTitle>
        <p>You just hit a route that doesn{'\u0027'}t exist... the sadness.</p>
    </Layout>
);

export default NotFoundPage;
