import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {
    type FC,
    type PropsWithChildren as PWC,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil';

const theme = createTheme();

export const Portal: FC = (props: PWC) => {
    const { children } = props;
    const defaultNode = useRef<HTMLDivElement | null>(null);
    const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

    const renderPortal = useCallback(() => {
        if (defaultNode.current === null) {
            const div = document.createElement('div');

            div.setAttribute(
                'style',
                'margin:0;padding:0;width:0;height:0;overflow:visible;'
            );

            defaultNode.current = div;
            document.body.appendChild(defaultNode.current);
        }

        const root = createRoot(defaultNode.current);
        root.render(
            <ThemeProvider theme={theme}>
                <RecoilBridge>{children}</RecoilBridge>
            </ThemeProvider>
        );
    }, [children]);

    useEffect(() => {
        renderPortal();

        return (): void => {
            if (defaultNode.current !== null) {
                ReactDOM.unmountComponentAtNode(defaultNode.current);

                document.body.removeChild(defaultNode.current);
            }

            defaultNode.current = null;
        };
    }, [renderPortal]);

    return <></>;
};

export default Portal;
