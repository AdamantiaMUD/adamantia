import {
    ArgParser,
    Character,
    CharacterEvents,
    CharacterUtils,
    CombatEngine,
    CombatErrors,
    Damage,
    FnUtils,
    type GameStateData,
    Logger,
    MobEvents,
    Npc,
    Player,
    PlayerEvents,
    RandomUtils,
} from '../../lib/index.js';

export class SimpleCombatEngine extends CombatEngine {
    public buildPrompt(player: Player): string {
        return '';
    }

    public chooseCombatant(attacker: Character): Character | null {
        if (attacker.combat.combatants.size === 0) {
            return null;
        }

        for (const target of attacker.combat.combatants) {
            if (!target.attributes.has('hp')) {
                throw new CombatErrors.CombatInvalidTargetError();
            }

            if (target.getAttribute('hp') > 0) {
                return target;
            }
        }

        return null;
    }

    public findCombatant(attacker: Player, search: string): Character | null {
        if (!search.length) {
            return null;
        }

        if (!attacker.room) {
            return null;
        }

        let possibleTargets: Character[] = [...attacker.room.npcs];
        if (attacker.getMeta('pvp')) {
            possibleTargets = [...possibleTargets, ...attacker.room.players];
        }

        const target = ArgParser.parseDot(search, possibleTargets);

        if (target === null) {
            return null;
        }

        if (target === attacker) {
            throw new CombatErrors.CombatTargetSelfError(
                'You smack yourself in the face. Ouch!'
            );
        }

        if (!target.hasBehavior('combat')) {
            throw new CombatErrors.CombatPacifistError(
                `${target.name} is a pacifist and will not fight you.`,
                target
            );
        }

        if (!target.attributes.has('hp')) {
            throw new CombatErrors.CombatInvalidTargetError(
                "You can't attack that target"
            );
        }

        if (!CharacterUtils.isNpc(target) && !target.getMeta('pvp')) {
            throw new CombatErrors.CombatNonPvpError(
                `${target.name} has not opted into PvP.`,
                target
            );
        }

        return target;
    }

    public handleDeath(
        state: GameStateData,
        victim: Character,
        killer?: Character | null | undefined
    ): void {
        if (victim.combat.killed) {
            return;
        }

        victim.combat.killed = true;
        victim.combat.disengage();

        Logger.log(
            `${killer ? killer.name : 'Something'} killed ${victim.name}.`
        );

        if (FnUtils.hasValue(killer)) {
            victim.combat.killedBy = killer;
            killer.dispatch(
                new CharacterEvents.CharacterDeathblowEvent({ target: victim })
            );
        }

        if (CharacterUtils.isNpc(victim)) {
            victim.dispatch(new MobEvents.NpcKilledEvent({ killer }));
            state.mobManager.remove(victim);
        } else {
            victim.dispatch(new PlayerEvents.PlayerKilledEvent({ killer }));
        }
    }

    public startRegeneration(state: GameStateData, combatant: Character): void {
        if (!combatant.hasEffectType('regen')) {
            return;
        }

        const regenEffect = state.effectFactory.create(
            'regen',
            { name: '', hidden: true },
            { magnitude: 15 }
        );

        if (combatant.addEffect(regenEffect)) {
            regenEffect.activate();
        }
    }

    public updateRound(state: GameStateData, attacker: Character): boolean {
        // entity was removed from the game but update event was still in flight, ignore it
        if (attacker.combat.killed) {
            return false;
        }

        if (!attacker.combat.isFighting()) {
            if (!(attacker instanceof Npc)) {
                // attacker.removePrompt('combat');
            }

            return false;
        }

        const lastRoundStarted = attacker.combat.roundStarted;
        attacker.combat.roundStarted = Date.now();

        // cancel if the attacker's combat lag hasn't expired yet
        if (attacker.combat.lag > 0) {
            const elapsed = Date.now() - lastRoundStarted;
            attacker.combat.lag -= elapsed;

            return false;
        }

        /*
         * currently just grabs the first combatant from their list but could easily be modified to
         * implement a threat table and grab the attacker with the highest threat
         */
        let target = null;
        try {
            target = this.chooseCombatant(attacker);
        } catch (e) {
            attacker.combat.disengage();
            throw e;
        }

        // no targets left, remove attacker from combat
        if (!target) {
            attacker.combat.disengage();
            return false;
        }

        // entity was removed from the game but update event was still in flight, ignore it
        if (target.combat.killed) {
            return false;
        }

        this._makeAttack(attacker, target);
        return true;
    }

    private _makeAttack(attacker: Character, target: Character): void {
        let amount = this._calculateWeaponDamage(attacker),
            critical = false;

        if (attacker.attributes.has('critical')) {
            const critChance = Math.max(
                attacker.getMaxAttribute('critical') || 0,
                0
            );
            critical = RandomUtils.probability(critChance);
            if (critical) {
                amount = Math.ceil(amount * 1.5);
            }
        }

        const weapon = attacker.equipment.get('wield');
        const damage = new Damage('hp', amount, attacker, weapon ?? null, {
            critical,
        });
        damage.commit(target);

        // currently lag is really simple, the character's weapon speed = lag
        attacker.combat.lag = this._getWeaponSpeed(attacker) * 1000;
    }

    private _calculateWeaponDamage(
        attacker: Character,
        average: boolean = false
    ): number {
        const weaponDamage = this._getWeaponDamage(attacker);
        let amount = 0;
        if (average) {
            amount = (weaponDamage.min + weaponDamage.max) / 2;
        } else {
            amount = RandomUtils.inRange(weaponDamage.min, weaponDamage.max);
        }

        return this._normalizeWeaponDamage(attacker, amount);
    }

    private _getWeaponDamage(attacker: Character): {
        max: number;
        min: number;
    } {
        const weapon = attacker.equipment.get('wield');

        const min = weapon?.getMeta<number>('minDamage') ?? 0;
        const max = weapon?.getMeta<number>('maxDamage') ?? 0;

        return { max, min };
    }

    private _getWeaponSpeed(attacker: Character): number {
        let speed = 2.0;
        const weapon = attacker.equipment.get('wield');
        if (!CharacterUtils.isNpc(attacker) && weapon) {
            speed = weapon.getMeta('speed') ?? 2.0;
        }

        return speed;
    }

    private _normalizeWeaponDamage(
        attacker: Character,
        amount: number
    ): number {
        const speed = this._getWeaponSpeed(attacker);
        amount += attacker.attributes.has('strength')
            ? attacker.getAttribute('strength')
            : attacker.level;
        return Math.round((amount / 3.5) * speed);
    }
}

export default SimpleCombatEngine;
