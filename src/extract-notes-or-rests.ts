import {createStack} from './stack.ts';

type NoteOrRest<T> = {
    type: 'note' | 'rest';
    num16: number;
    level1: boolean;
    level2: boolean;
    data?: T;
}
export const extractNotesOrRests = <T>(layer: string, secondLayer?: string, onCreateNoteOrRest?: (symbol1: string, symbol2?: string) => T) => {
    const kkStack = createStack<NoteOrRest<T>>();
    for (let i = 0; i < layer.length; ++i) {
        const symbol1 = layer[i];
        const symbol2 = secondLayer ? secondLayer[i] : undefined;
        if (
            symbol1 !== ' '
            || (
                symbol2 !== undefined && symbol2 !== ' '
            )
        ) {
            // Note on at least one
            kkStack.push({
                type: 'note',
                num16: 1,
                level1: symbol1 !== ' ',
                level2: symbol2 !== undefined && symbol2 !== ' ',
                data: !!onCreateNoteOrRest ? onCreateNoteOrRest(symbol1, symbol2) : undefined,
            });
        } else {
            // Rest on all
            const lastNoteOrRest = kkStack.top();
            (() => {
                if (lastNoteOrRest) {
                    if (lastNoteOrRest.num16 < 4) {
                        kkStack.pop();
                        kkStack.push({
                            type: lastNoteOrRest.type === 'note'
                                ? 'note'
                                : 'rest',
                            level1: lastNoteOrRest.level1,
                            level2: lastNoteOrRest.level2,
                            num16: lastNoteOrRest.num16 + 1,
                            data: lastNoteOrRest.data,
                        })
                        return;
                    }
                }
                kkStack.push({
                    type: 'rest',
                    num16: 1,
                    level1: false,
                    level2: false,
                });
            })();
        }
    }
    return kkStack;
};
