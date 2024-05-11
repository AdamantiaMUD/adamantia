import type { RoomDefinition } from '@adamantiamud/core';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';

export interface UseRoomResult {
    data: RoomDefinition | null;
    error: Error | null;
    isFetching: boolean;
    isPending: boolean;
    status: UseQueryResult['status'];
}

const useRoom = (id: string | null): UseRoomResult => {
    const { isPending, error, data, isFetching, status } = useQuery({
        enabled: id !== null,
        queryKey: ['rooms', id],
        queryFn: async () =>
            axios
                .get<RoomDefinition>(`http://localhost:4001/rooms/${id!}`)
                .then((res: AxiosResponse<RoomDefinition>) => res.data),
        retryOnMount: false,
    });

    return {
        data: data ?? null,
        error: error,
        isFetching: isFetching,
        isPending: isPending,
        status: status,
    };
};

export default useRoom;
