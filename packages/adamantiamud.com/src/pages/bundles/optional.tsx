import React, {FC} from 'react';
import {PageRendererProps} from 'gatsby';

import Layout from '../../components/layout';
import PageTitle from '../../components/general/page-title';
import SEO from '../../components/seo';

export const OptionalBundlesPage: FC<PageRendererProps> = ({location}: PageRendererProps) => (
    <Layout location={location}>
        <SEO title="Optional Bundles" />
        <PageTitle>Optional Bundles</PageTitle>
    </Layout>
);

export default OptionalBundlesPage;
