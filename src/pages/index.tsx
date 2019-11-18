import React, {FC} from 'react';
import {PageRendererProps} from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

export const IndexPage: FC<PageRendererProps> = ({location}: PageRendererProps) => (
    <Layout location={location}>
        <SEO title="Home" />
        <h1>{'Home'}</h1>
    </Layout>
);

export default IndexPage;
