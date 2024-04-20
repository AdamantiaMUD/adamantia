/* eslint-disable @typescript-eslint/no-floating-promises */
import localforage from 'localforage';
import {DefaultValue} from 'recoil';

import type {AtomEffect} from 'recoil';

type EffectParam<T> = Parameters<AtomEffect<T>>[0];

export const localForageEffect = <T>(key: string): AtomEffect<T> => ({setSelf, onSet}: EffectParam<T>): void => {
    localforage.getItem(key)
        .then((savedValue: unknown): void => {
            if (savedValue !== null) {
                setSelf(JSON.parse(String(savedValue)));
            }

            onSet((newValue: T | DefaultValue) => {
                if (newValue instanceof DefaultValue) {
                    localforage.removeItem(key);
                }
                else {
                    localforage.setItem(key, JSON.stringify(newValue));
                }
            });
        });
};

export default localForageEffect;
