import Attribute from '../../../src/lib/attributes/attribute.js';

describe('Attribute', () => {
    describe('modify()', () => {
        it('should lower the attribute given a negative number', () => {
            expect.assertions(2);

            const att = new Attribute('test', 15);

            att.modify(-5);

            expect(att.delta).toBe(-5);
            expect(att.value).toBe(10);
        });

        it('should raise the attribute given a positive number', () => {
            expect.assertions(2);

            const att = new Attribute('test', 15, -10);

            att.modify(3);

            expect(att.delta).toBe(-7);
            expect(att.value).toBe(8);
        });
    });

    describe('reset()', () => {
        it('should set the delta back to 0', () => {
            expect.assertions(2);

            const att = new Attribute('test', 15);

            att.setDelta(-5);

            expect(att.delta).toBe(-5);

            att.reset();

            expect(att.delta).toBe(0);
        });
    });

    describe('setBase()', () => {
        it('sets the base value of the attribute', () => {
            expect.assertions(1);

            const att = new Attribute('test', 15);

            att.setBase(25);

            expect(att.base).toBe(25);
        });

        it('will not set a base value below 0', () => {
            expect.assertions(1);

            const att = new Attribute('test', 15);

            att.setBase(-25);

            expect(att.base).toBe(0);
        });
    });

    describe('setDelta()', () => {
        it('sets the delta value of the attribute', () => {
            expect.assertions(1);

            const att = new Attribute('test', 15);

            att.setDelta(-5);

            expect(att.delta).toBe(-5);
        });

        it('will not set a base value below 0', () => {
            expect.assertions(1);

            const att = new Attribute('test', 15);

            att.setDelta(5);

            expect(att.delta).toBe(0);
        });
    });
});
