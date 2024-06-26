import type Effect from '../effect.js';

export type EffectAttributeModifierFunction = (
    effect: Effect,
    attribute: string,
    current: number
) => number;

export default EffectAttributeModifierFunction;
