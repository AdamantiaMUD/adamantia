import type Helpfile from './helpfile.js';

export class HelpManager {
    /* eslint-disable @typescript-eslint/lines-between-class-members */
    public helps: Map<string, Helpfile> = new Map<string, Helpfile>();
    /* eslint-enable @typescript-eslint/lines-between-class-members */

    public add(help: Helpfile): void {
        this.helps.set(help.name, help);
    }

    public find(search: string): Map<string, Helpfile> {
        const results: Map<string, Helpfile> = new Map<string, Helpfile>();

        for (const [name, help] of this.helps.entries()) {
            if (name.startsWith(search)) {
                results.set(name, help);
            } else if (
                help.keywords.some((keyword: string) =>
                    keyword.includes(search)
                )
            ) {
                results.set(name, help);
            }
        }

        return results;
    }

    public get(help: string): Helpfile | null {
        return this.helps.get(help) ?? null;
    }

    public getFirst(search: string): Helpfile | null {
        const results = this.find(search);

        if (results.size === 0) {
            /**
             * No results found
             */
            return null;
        }

        const [, help] = [...results][0];

        return help;
    }
}

export default HelpManager;
