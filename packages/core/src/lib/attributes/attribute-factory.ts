import { sprintf } from 'sprintf-js';
import type { RequiredDeep } from 'type-fest';

import { hasValue } from '../util/functions.js';

import type AttributeDefinition from './attribute-definition.js';
import Attribute from './attribute.js';

export class AttributeFactory {
    private readonly _attributes: Map<string, AttributeDefinition> = new Map<
        string,
        AttributeDefinition
    >();

    private _hasCircularDependency(
        attr: string,
        references: Record<string, string[]>,
        stack: string[] = []
    ): string[] | false {
        if (stack.includes(attr)) {
            return stack;
        }

        const requires = references[attr];

        if (!hasValue(requires) || requires.length === 0) {
            return false;
        }

        for (const reqAttr of requires) {
            const check = this._hasCircularDependency(
                reqAttr,
                references,
                stack.concat(attr)
            );

            if (check !== false) {
                return check;
            }
        }

        return false;
    }

    public add(def: AttributeDefinition): void {
        this._attributes.set(def.name, def);
    }

    public create(
        name: string,
        base: number | null = null,
        delta: number = 0
    ): Attribute | null {
        if (!this.has(name)) {
            throw new RangeError(`No attribute definition found for [${name}]`);
        }

        const def = this._attributes.get(name);

        if (!hasValue(def)) {
            return null;
        }

        return new Attribute(
            name,
            base ?? def.base,
            delta,
            def.formula,
            def.metadata
        );
    }

    /**
     * Get a attribute definition. Use `create` if you want an instance of a attribute
     */
    public get(name: string): AttributeDefinition | null {
        return this._attributes.get(name) ?? null;
    }

    public getRequiredAttributes(
        kind: keyof RequiredDeep<AttributeDefinition['entityTypes']>
    ): string[] {
        return [...this._attributes].reduce<string[]>(
            (
                acc: string[],
                [attrName, { entityTypes }]: [string, AttributeDefinition]
            ) => {
                if (entityTypes?.[kind] === 'required') {
                    acc.push(attrName);
                }

                return acc;
            },
            []
        );
    }

    public has(name: string): boolean {
        return this._attributes.has(name);
    }

    /**
     * Make sure there are no circular dependencies between attributes
     */
    public validateAttributes(): void {
        const references = [...this._attributes].reduce<
            Record<string, string[]>
        >(
            (
                acc: Record<string, string[]>,
                [attrName, { formula }]: [string, AttributeDefinition]
            ) => {
                if (!hasValue(formula)) {
                    return acc;
                }

                return {
                    ...acc,
                    [attrName]: formula.requires,
                };
            },
            {}
        );

        for (const attrName in references) {
            /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- `hasOwnProperty` is boolean, but `call` doesn't know that */
            if (Object.hasOwn(references, attrName)) {
                const check = this._hasCircularDependency(attrName, references);

                if (Array.isArray(check)) {
                    const path = check.concat(attrName).join(' -> ');

                    throw new Error(
                        sprintf(
                            'Attribute formula for [%1$s] has circular dependency [%2$s]',
                            attrName,
                            path
                        )
                    );
                }
            }
        }
    }
}

export default AttributeFactory;
