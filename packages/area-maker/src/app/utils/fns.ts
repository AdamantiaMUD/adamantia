/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any -- `any` is actually required here */
export const cast = <T>(obj: any): T => obj as unknown as T;
