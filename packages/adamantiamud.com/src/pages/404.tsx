import React, {FC} from 'react';
import {PageRendererProps} from 'gatsby';

import Layout from '../components/layout';
import PageTitle from '../components/general/page-title';
import SEO from '../components/seo';

export const NotFoundPage: FC<PageRendererProps> = ({location}: PageRendererProps) => (
    <Layout location={location}>
        <SEO title="404: Not found" />
        <PageTitle>NOT FOUND</PageTitle>
        <p>You just hit a route that doesn{'\u0027'}t exist... the sadness.</p>
    </Layout>
);

export default NotFoundPage;
