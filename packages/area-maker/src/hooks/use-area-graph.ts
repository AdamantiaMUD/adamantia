import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';
import { useMemo } from 'react';

import type { AreaGraph } from '~/context/area-context';

export interface UseAreaGraphResult {
    data: {
        id: string;
        graph: AreaGraph;
    } | null;
    error: Error | null;
    isFetching: boolean;
    isPending: boolean;
    status: UseQueryResult['status'];
}

export const useAreaGraph = (id: string | null): UseAreaGraphResult => {
    const { isPending, error, data, isFetching, status } = useQuery({
        enabled: id !== null,
        queryKey: ['areas', id, 'graph'],
        queryFn: async () =>
            axios
                .get<AreaGraph>(`http://localhost:4001/areas/${id!}/graph`)
                .then((res: AxiosResponse<AreaGraph>) => res.data),
    });

    const graphData = useMemo((): UseAreaGraphResult['data'] => {
        if (id === null || status !== 'success') {
            return null;
        }

        if (Array.isArray(data)) {
            return {
                id: id,
                graph: data,
            };
        }

        return null;
    }, [data, id, status]);

    return {
        data: graphData,
        error: error,
        isFetching: isFetching,
        isPending: isPending,
        status: status,
    };
};

export default useAreaGraph;
