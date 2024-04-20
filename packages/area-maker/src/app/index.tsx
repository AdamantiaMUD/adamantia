/* global module */
import React from 'react';
import ReactDOM from 'react-dom';
import {RecoilRoot} from 'recoil';

import AreaCanvas from '~/components/canvas/area-canvas';

ReactDOM.render(
    (<RecoilRoot><AreaCanvas /></RecoilRoot>),
    document.getElementById('root')
);

if (typeof module.hot !== 'undefined') {
    module.hot.accept();
}
