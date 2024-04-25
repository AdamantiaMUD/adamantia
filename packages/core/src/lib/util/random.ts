import { Chance } from 'chance';

export const random: Chance.Chance = new Chance();

export const inRange = (min: number, max: number): number =>
    random.integer({ min, max });

export const probability = (likelihood: number): boolean =>
    random.bool({ likelihood });

export default random;
