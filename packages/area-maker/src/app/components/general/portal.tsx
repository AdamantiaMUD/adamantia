import React, {useCallback, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import {useRecoilBridgeAcrossReactRoots_UNSTABLE} from 'recoil';

import type {FC, PropsWithChildren as PWC} from 'react';

/* eslint-disable-next-line @typescript-eslint/ban-types */
export const Portal: FC = (props: PWC<{}>) => {
    const {children} = props;
    const defaultNode = useRef<HTMLDivElement | null>(null);
    const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

    const renderPortal = useCallback(() => {
        if (defaultNode.current === null) {
            const div = document.createElement('div');

            div.setAttribute('style', 'margin:0;padding:0;width:0;height:0;overflow:visible;');

            defaultNode.current = div;
            document.body.appendChild(defaultNode.current);
        }

        ReactDOM.render(
            /* eslint-disable-next-line react/jsx-no-useless-fragment */
            (<RecoilBridge>{children}</RecoilBridge>),
            defaultNode.current
        );
    }, [children]);

    useEffect(
        () => {
            renderPortal();

            return (): void => {
                if (defaultNode.current !== null) {
                    ReactDOM.unmountComponentAtNode(defaultNode.current);

                    document.body.removeChild(defaultNode.current);
                }

                defaultNode.current = null;
            };
        },
        [renderPortal]
    );

    return null;
};

export default Portal;
