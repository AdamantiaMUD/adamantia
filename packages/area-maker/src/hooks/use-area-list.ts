import { useQuery } from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';

export interface AreaListItem {
    id: string;
    name: string;
    description: string;
    roomCount: number;
}

export interface UseAreaList {
    areas: AreaListItem[];
    error: Error | null;
    isFetching: boolean;
    isPending: boolean;
}

export const useAreaList = (): UseAreaList => {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['areas'],
        queryFn: async () =>
            axios
                .get<AreaListItem[]>('http://localhost:4001/areas')
                .then((res: AxiosResponse<AreaListItem[]>) => res.data),
    });

    return {
        areas: data ?? [],
        error: error,
        isFetching: isFetching,
        isPending: isPending,
    };
};

export default useAreaList;
