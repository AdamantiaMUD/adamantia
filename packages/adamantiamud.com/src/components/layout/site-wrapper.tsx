/** @jsx jsx */
import {jsx} from '@emotion/core';
import {FC, PropsWithChildren as PWC} from 'react';
import {useTheme} from 'emotion-theming';

import {SiteTheme} from '../../util/site-theme';

export const SiteWrapper: FC = (props: PWC<never>) => {
    const {layout} = useTheme<SiteTheme>();

    const css = {
        display: 'grid',
        gridTemplateRows: `${layout.siteNavHeight} 1fr`,
        height: '100%',
        overflow: 'hidden',
    };

    return (<div css={css} {...props} />);
};

export default SiteWrapper;
