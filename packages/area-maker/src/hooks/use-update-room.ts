import type { RoomDefinition } from '@adamantiamud/core';
import type {
    UpdateRoomByIdRequest,
    UpdateRoomByIdResponse,
} from '@adamantiamud/core/http';
import {
    type UseMutateFunction,
    type UseMutationResult,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';

export interface UseUpdateRoomResult {
    data: RoomDefinition | null;
    error: Error | null;
    isPending: boolean;
    mutate: UseMutateFunction<RoomDefinition, unknown, Partial<RoomDefinition>>;
    status: UseMutationResult['status'];
}

const useUpdateRoom = (id: string | null): UseUpdateRoomResult => {
    const queryClient = useQueryClient();
    const { isPending, error, data, mutate, status } = useMutation({
        mutationFn: async (room: UpdateRoomByIdRequest) => {
            const { data: updatedRoomDefinition } = await axios.put<
                UpdateRoomByIdResponse,
                AxiosResponse<UpdateRoomByIdResponse>,
                UpdateRoomByIdRequest
            >(`http://localhost:4001/rooms/${id!}`, room);

            return updatedRoomDefinition;
        },
        onSuccess: (updatedRoomDefinition: UpdateRoomByIdResponse) => {
            queryClient.setQueryData(['rooms', id], updatedRoomDefinition);
        },
    });

    return {
        data: data ?? null,
        error: error,
        isPending: isPending,
        /* eslint-disable-next-line @typescript-eslint/no-empty-function */
        mutate: id === null ? (): void => {} : mutate,
        status: status,
    };
};

export default useUpdateRoom;
