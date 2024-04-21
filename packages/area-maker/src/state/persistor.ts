/* eslint-disable @typescript-eslint/no-floating-promises */
import localforage from 'localforage';
import { type AtomEffect, DefaultValue } from 'recoil';

/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
type EffectParam<T> = Parameters<AtomEffect<T>>[0];

export const localForageEffect =
    <T>(key: string): AtomEffect<T> =>
    ({ setSelf, onSet }: EffectParam<T>): void => {
        localforage.getItem(key).then((savedValue: unknown): void => {
            if (savedValue !== null) {
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
                setSelf(JSON.parse(String(savedValue)));
            }

            onSet((newValue: T | DefaultValue) => {
                if (newValue instanceof DefaultValue) {
                    localforage.removeItem(key);
                } else {
                    localforage.setItem(key, JSON.stringify(newValue));
                }
            });
        });
    };

export default localForageEffect;
