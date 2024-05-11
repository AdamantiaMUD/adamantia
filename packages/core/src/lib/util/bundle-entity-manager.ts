export interface BundleEntityManager<T> {
    getAll: () => Map<string, T>;
    add: (ref: string, entity: T, bundlePath: string) => void;
    get: (ref: string) => T | null;
    getPath: (ref: string) => string | null;
    remove: (ref: string) => void;
    size: () => number;
}
