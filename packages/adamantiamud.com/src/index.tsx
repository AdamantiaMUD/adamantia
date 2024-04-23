import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import CoreBundlesPage from '~/pages/bundles/core';
import OptionalBundlesPage from '~/pages/bundles/optional';
import ContributingPage from '~/pages/contributing';
import GettingStartedPage from '~/pages/getting-started';
import HomePage from '~/pages/index';
import LicenseCreditsPage from '~/pages/license-credits';
import ReleaseNotesPage from '~/pages/release-notes';
import SourceDocsPage from '~/pages/source-docs';
import routes from '~/util/routes';
import { theme } from '~/util/site-theme';

import './styles.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
    { path: routes.bundles.core, element: <CoreBundlesPage /> },
    { path: routes.bundles.optional, element: <OptionalBundlesPage /> },
    { path: routes.contributing, element: <ContributingPage /> },
    { path: routes.gettingStarted, element: <GettingStartedPage /> },
    { path: routes.home, element: <HomePage /> },
    { path: routes.licenseCredits, element: <LicenseCreditsPage /> },
    { path: routes.releaseNotes, element: <ReleaseNotesPage /> },
    { path: routes.sourceDocs, element: <SourceDocsPage /> },
]);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RecoilRoot>
                <RouterProvider router={router} />
            </RecoilRoot>
        </ThemeProvider>
    </React.StrictMode>
);
