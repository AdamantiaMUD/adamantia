import type { RoomDefinition } from '@adamantiamud/core';
import type { ElementDefinition } from 'cytoscape';
import {
    type ChangeEvent,
    type FC,
    type PropsWithChildren as PWC,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export interface AreaContextType {
    name: string;
    rooms: Record<string, RoomDefinition>;
    roomNodes: ElementDefinition[];
    layer: number;
    minMax: { min: number; max: number };
    handleLayerUp: () => void;
    handleLayerDown: () => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    selectedRoom: string | null;
    setSelectedRoom: (roomId: string | null) => void;
}

const AreaContext = createContext<AreaContextType | null>(null);

export const AreaContextProvider: FC<PWC> = ({ children }: PWC) => {
    const [name, setName] = useState<string>('');
    const [rooms, setRooms] = useState<Record<string, RoomDefinition>>({});
    const [roomNodes, setRoomNodes] = useState<ElementDefinition[]>([]);
    const [layer, setLayer] = useState<number>(0);
    const [minMax, setMinMax] = useState<{ min: number; max: number }>({
        min: -Infinity,
        max: Infinity,
    });
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

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

    const handleFileChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>): void => {
            const process = async (): Promise<void> => {
                const file = e.target.files![0];
                const text = await file.text();
                const data = JSON.parse(text) as {
                    name: string;
                    rooms: Record<string, RoomDefinition>;
                    nodes: ElementDefinition[];
                };

                setSelectedRoom(null);
                setName(data.name);
                setRoomNodes(data.nodes);
                setRooms(data.rooms);
            };

            /* eslint-disable-next-line no-void */
            void process();
        },
        [setName, setRoomNodes, setRooms]
    );

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
            name,
            rooms,
            roomNodes,
            layer,
            minMax,
            handleLayerUp,
            handleLayerDown,
            handleFileChange,
            selectedRoom,
            setSelectedRoom,
        }),
        [
            name,
            rooms,
            roomNodes,
            layer,
            minMax,
            handleLayerUp,
            handleLayerDown,
            handleFileChange,
            selectedRoom,
            setSelectedRoom,
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
