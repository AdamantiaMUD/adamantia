import BehaviorManager from '../../../src/lib/behaviors/behavior-manager.js';
import MudEventManager from '../../../src/lib/events/mud-event-manager.js';

describe('BehaviorManager', () => {
    describe('#addListener', () => {
        it('should should add the listener to the specified behavior and event', () => {
            expect.assertions(1);

            const mgr = new BehaviorManager();
            const behavior = mgr.get('listen');

            mgr.addListener('listen', 'music', () => {});

            expect(behavior.get('music').size).toBe(1);
        });
    });

    describe('#get', () => {
        it('should return an empty event manager if the given behavior has no listeners', () => {
            expect.assertions(2);

            const mgr = new BehaviorManager();

            expect(mgr.get('missing')).toBeInstanceOf(MudEventManager);
            expect(mgr.get('missing').size).toBe(0);
        });

        it('should return an event manager with the expected number of listeners', () => {
            expect.assertions(2);

            const mgr = new BehaviorManager();

            mgr.addListener('present', 'give', () => {});

            expect(mgr.get('present')).toBeInstanceOf(MudEventManager);
            expect(mgr.get('present').size).toBe(1);
        });
    });

    describe('#has', () => {
        it('should return false if the given behavior is not found', () => {
            expect.assertions(1);

            const mgr = new BehaviorManager();

            expect(mgr.has('missing')).toBe(false);
        });

        it('should return true if the given behavior exists', () => {
            expect.assertions(1);

            const mgr = new BehaviorManager();

            mgr.addListener('present', 'give', () => {});

            expect(mgr.has('present')).toBe(true);
        });
    });
});
