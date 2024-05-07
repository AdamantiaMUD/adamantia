import type { ElementDefinition } from 'cytoscape';
import {
    type FC,
    type PropsWithChildren as PWC,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import useAreaGraph from '~/hooks/use-area-graph';
import type { AreaListItem } from '~/hooks/use-area-list';

export type AreaGraph = ElementDefinition[];

export interface AreaContextType {
    area: AreaListItem | null;
    roomNodes: ElementDefinition[];
    layer: number;
    minMax: { min: number; max: number };
    handleLayerUp: () => void;
    handleLayerDown: () => void;
    selectedRoom: string | null;
    setSelectedRoom: (roomId: string | null) => void;
    setArea: (area: AreaListItem) => void;
}

const AreaContext = createContext<AreaContextType | null>(null);

export const AreaContextProvider: FC<PWC> = ({ children }: PWC) => {
    const [area, setArea] = useState<AreaListItem | null>(null);
    const [roomNodes, setRoomNodes] = useState<ElementDefinition[]>([]);
    const [layer, setLayer] = useState<number>(0);
    const [minMax, setMinMax] = useState<{ min: number; max: number }>({
        min: -Infinity,
        max: Infinity,
    });
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    const { data, status } = useAreaGraph(area?.id ?? null);

    useEffect(() => {
        if (area === null || status !== 'success') {
            return;
        }

        if (data === null) {
            return;
        }

        setSelectedRoom(null);
        setRoomNodes(data.graph);
    }, [area, data, status]);

    const handleLayerUp = useCallback((): void => {
        setLayer((prev: number): number => {
            if (prev === minMax.max) {
                return prev;
            }
            return prev + 1;
        });
    }, [minMax, setLayer]);

    const handleLayerDown = useCallback((): void => {
        setLayer((prev: number): number => {
            if (prev === minMax.min) {
                return prev;
            }
            return prev - 1;
        });
    }, [minMax, setLayer]);

    useEffect(() => {
        const [minimum, maximum] = roomNodes.reduce(
            (
                [min, max]: [number, number],
                node: ElementDefinition
            ): [number, number] => {
                const {
                    data: { layer: nodeLayer },
                } = node;

                if (typeof nodeLayer !== 'number') {
                    return [min, max];
                }

                return [Math.min(min, nodeLayer), Math.max(max, nodeLayer)];
            },
            [Infinity, -Infinity]
        );

        setMinMax({ min: minimum, max: maximum });
    }, [roomNodes, setMinMax]);

    const ctx = useMemo(
        () => ({
            area,
            roomNodes,
            layer,
            minMax,
            handleLayerUp,
            handleLayerDown,
            selectedRoom,
            setSelectedRoom,
            setArea,
        }),
        [
            area,
            roomNodes,
            layer,
            minMax,
            handleLayerUp,
            handleLayerDown,
            selectedRoom,
            setSelectedRoom,
            setArea,
        ]
    );

    return <AreaContext.Provider value={ctx}>{children}</AreaContext.Provider>;
};

export const useAreaContext = (): AreaContextType => {
    const context = useContext(AreaContext);

    if (context === null) {
        throw new Error(
            'useAreaContext must be used within an AreaContextProvider'
        );
    }

    return context;
};
