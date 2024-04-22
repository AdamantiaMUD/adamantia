import React, {FC} from 'react';
import {PageRendererProps} from 'gatsby';

import Layout from '../components/layout';
import PageTitle from '../components/general/page-title';
import SEO from '../components/seo';

export const SecondPage: FC<PageRendererProps> = ({location}: PageRendererProps) => (
    <Layout location={location}>
        <SEO title="Source Docs" />
        <PageTitle>Source Docs</PageTitle>
    </Layout>
);

export default SecondPage;
